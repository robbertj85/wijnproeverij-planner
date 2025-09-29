import { randomUUID, createHmac } from 'crypto';

const TOKEN_SECRET = process.env.TOKEN_SECRET;

// Validate TOKEN_SECRET on module load
if (!TOKEN_SECRET) {
  throw new Error(
    'TOKEN_SECRET environment variable is required. ' +
    'Add it to .env.local with a strong random value (min 32 characters).'
  );
}

if (process.env.NODE_ENV === 'production' && TOKEN_SECRET.length < 32) {
  throw new Error(
    'TOKEN_SECRET must be at least 32 characters in production for security. ' +
    'Generate one with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"'
  );
}

/**
 * Generate a unique participation token for an invitee
 * Returns a UUID that can be used for no-auth guest access
 */
export function generateParticipationToken(): string {
  return randomUUID();
}

/**
 * Generate a signed token that can be validated
 * Used for secure invite links and email tokens
 */
export function generateSignedToken(payload: string): string {
  const token = randomUUID();
  const signature = createHmac('sha256', TOKEN_SECRET)
    .update(`${token}:${payload}`)
    .digest('hex');

  return `${token}.${signature}`;
}

/**
 * Validate a signed token
 * Returns true if the token signature is valid
 */
export function validateSignedToken(signedToken: string, payload: string): boolean {
  try {
    const [token, signature] = signedToken.split('.');

    if (!token || !signature) {
      return false;
    }

    const expectedSignature = createHmac('sha256', TOKEN_SECRET)
      .update(`${token}:${payload}`)
      .digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    return false;
  }
}

/**
 * Check if a token has expired
 * Tokens are valid for 30 days by default
 */
export function isTokenExpired(tokenCreatedAt: Date, expiryDays: number = 30): boolean {
  const expiryDate = new Date(tokenCreatedAt);
  expiryDate.setDate(expiryDate.getDate() + expiryDays);

  return new Date() > expiryDate;
}

/**
 * Generate a short, shareable event code (8 characters)
 * Useful for easy event access via code entry
 */
export function generateEventCode(): string {
  return randomUUID().split('-')[0].toUpperCase();
}