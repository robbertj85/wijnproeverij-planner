/**
 * Simple in-memory rate limiter
 * For production, consider using:
 * - @upstash/ratelimit with Redis
 * - Vercel Edge Config
 * - Database-based rate limiting
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   */
  maxRequests: number;

  /**
   * Time window in seconds
   */
  windowSeconds: number;

  /**
   * Unique identifier for this rate limit bucket
   * Usually the action name + identifier (e.g., "create-event:192.168.1.1")
   */
  identifier: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Check if a request is allowed under rate limit
 */
export function rateLimit(config: RateLimitConfig): RateLimitResult {
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = config.identifier;

  let entry = store.get(key);

  // Initialize or reset if window expired
  if (!entry || now > entry.resetAt) {
    entry = {
      count: 0,
      resetAt: now + windowMs,
    };
    store.set(key, entry);
  }

  // Increment count
  entry.count++;

  // Check if over limit
  const success = entry.count <= config.maxRequests;
  const remaining = Math.max(0, config.maxRequests - entry.count);

  return {
    success,
    limit: config.maxRequests,
    remaining,
    reset: entry.resetAt,
  };
}

/**
 * Get client identifier from headers
 * Uses IP address, falls back to a random identifier
 */
export function getClientIdentifier(headers: Headers): string {
  // Try to get real IP from various headers
  const forwardedFor = headers.get('x-forwarded-for');
  const realIp = headers.get('x-real-ip');
  const cfConnectingIp = headers.get('cf-connecting-ip'); // Cloudflare

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, use the first one
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  // Fallback to 'unknown' for development
  // In production with proper proxies, this should rarely be hit
  return 'unknown';
}

/**
 * Rate limit presets for common actions
 */
export const RATE_LIMITS = {
  EVENT_CREATION: {
    maxRequests: 5,
    windowSeconds: 3600, // 5 events per hour
  },
  WINE_SUBMISSION: {
    maxRequests: 10,
    windowSeconds: 300, // 10 wines per 5 minutes
  },
  AVAILABILITY_SUBMISSION: {
    maxRequests: 20,
    windowSeconds: 300, // 20 submissions per 5 minutes
  },
  RATING_SUBMISSION: {
    maxRequests: 50,
    windowSeconds: 300, // 50 ratings per 5 minutes (multiple wines)
  },
} as const;