# Security Audit Report
**Date:** 2025-09-29
**App:** Wine Tasting Scheduler
**Auditor:** Claude Code

---

## Executive Summary

Completed comprehensive security audit of the Wine Tasting Scheduler application. Found **1 critical** and **2 moderate** security issues that require attention before production deployment.

**Overall Risk Level:** 🟡 MODERATE (fixable before production)

---

## Critical Issues

### 🔴 1. Weak Token Secret Fallback
**Severity:** CRITICAL
**File:** `lib/tokens.ts:3`
**Issue:** Falls back to predictable default secret if `TOKEN_SECRET` env var is missing

```typescript
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'development-secret-change-in-production';
```

**Risk:**
- Attackers can forge invite tokens
- Guest access tokens can be predicted
- Complete authentication bypass possible

**Fix Required:**
```typescript
const TOKEN_SECRET = process.env.TOKEN_SECRET;

if (!TOKEN_SECRET) {
  throw new Error('TOKEN_SECRET environment variable is required');
}

if (process.env.NODE_ENV === 'production' && TOKEN_SECRET.length < 32) {
  throw new Error('TOKEN_SECRET must be at least 32 characters in production');
}
```

---

## Moderate Issues

### 🟠 2. Dependency Vulnerabilities
**Severity:** MODERATE
**Found:** 5 moderate vulnerabilities in dev dependencies

```
esbuild  <=0.24.2 - Development server vulnerability
└─ affects: vite, vitest (dev dependencies only)
```

**Risk:**
- Only affects development environment
- No production impact
- Could allow CSRF during local development

**Fix:**
```bash
npm audit fix --force
# OR wait for upstream patches
```

### 🟠 3. Missing Rate Limiting
**Severity:** MODERATE
**Files:** All server actions
**Issue:** No rate limiting on event creation or form submissions

**Risk:**
- Spam event creation
- Database flooding
- Potential DoS via excessive requests

**Recommended Fix:**
- Add rate limiting middleware (e.g., `@upstash/ratelimit`)
- Limit event creation to 10/hour per IP
- Limit wine submissions to 5/minute per token

---

## Security Strengths ✅

### 1. SQL Injection Protection
- ✅ **Prisma ORM** used throughout - parameterized queries only
- ✅ No raw SQL found
- ✅ All database queries are type-safe

### 2. XSS Prevention
- ✅ No `dangerouslySetInnerHTML` usage
- ✅ React auto-escapes all output
- ✅ No `eval()` or dynamic code execution
- ✅ Form inputs properly sanitized

### 3. CSRF Protection
- ✅ Next.js Server Actions have built-in CSRF protection
- ✅ All mutations use POST with tokens
- ✅ `'use server'` directive properly applied

### 4. Input Validation
- ✅ Participant limits enforced (2-8 users)
- ✅ Email validation present
- ✅ Form field sanitization with `.trim()`
- ✅ Type safety via TypeScript strict mode

### 5. Authentication
- ✅ UUID tokens (cryptographically random)
- ✅ HMAC-SHA256 signatures for validation
- ✅ Token expiry checks (30 days)
- ✅ No authentication credentials stored

### 6. Sensitive Data Protection
- ✅ `.env.local` in `.gitignore`
- ✅ `emails/` directory gitignored
- ✅ No secrets in codebase
- ✅ Prisma query logging disabled in production

### 7. File System Security
- ✅ File writes only to designated `emails/` directory
- ✅ Filename sanitization in email file writer
- ✅ No user-controlled file paths
- ✅ Safe path joining with `path.join()`

---

## Recommendations for Production

### Immediate (Before Deploy)
1. **Set strong TOKEN_SECRET** (32+ random characters)
2. **Remove fallback secret** - make env var required
3. **Add TOKEN_SECRET validation** on app startup
4. **Run `npm audit fix`** for dev dependencies

### High Priority
5. **Add rate limiting** to all server actions
6. **Implement email verification** (if not using tokens from trusted source)
7. **Add logging/monitoring** for suspicious activity
8. **Enable database connection pooling** in production

### Security Headers (Recommended)
Add to `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
  ];
},
```

### Optional Enhancements
- Content Security Policy (CSP) headers
- Implement honeypot fields for bot detection
- Add CAPTCHA for public event creation
- Enable Vercel WAF if using Vercel Pro
- Set up Sentry for error tracking
- Implement audit logging for sensitive actions

---

## Database Security

### Current State
- ✅ Parameterized queries (Prisma)
- ✅ Type-safe schema
- ✅ Proper indexing
- ✅ Cascade deletes configured

### Recommendations
- Enable connection pooling in production
- Set `pool` settings in `DATABASE_URL`
- Consider read replicas for scaling
- Enable slow query logging
- Set up automated backups

---

## API Security

### Current State
- ✅ Server Actions (not public API endpoints)
- ✅ Token-based guest access
- ✅ No public mutations without tokens

### Recommendations
- Document token flow for security review
- Add request size limits (Next.js default: 1MB is fine)
- Monitor for token reuse patterns
- Implement token rotation after use (optional)

---

## Deployment Checklist

Before deploying to production:

- [ ] Set `TOKEN_SECRET` to strong random value (32+ chars)
- [ ] Remove secret fallback in `lib/tokens.ts`
- [ ] Verify `.env` not committed
- [ ] Run `npm audit` and fix critical issues
- [ ] Test token validation with production secret
- [ ] Enable database SSL in production `DATABASE_URL`
- [ ] Set up monitoring/alerting
- [ ] Configure Vercel security headers
- [ ] Test rate limiting if implemented
- [ ] Review all console.log statements for sensitive data

---

## Compliance Notes

### GDPR Considerations
- Email addresses are collected (PII)
- No explicit consent flow implemented
- Consider adding privacy policy
- Implement data deletion mechanism
- Add email unsubscribe option

### Recommendations
- Add "Delete Event" functionality for GDPR compliance
- Implement data retention policy
- Add privacy policy page
- Consider cookie consent banner if adding analytics

---

## Testing Performed

- ✅ Static code analysis
- ✅ Dependency vulnerability scan
- ✅ Pattern matching for common vulnerabilities
- ✅ Environment variable exposure check
- ✅ Authentication flow review
- ✅ Input validation testing
- ✅ File system security audit

**Not Tested:**
- Penetration testing
- Load testing
- Token brute force attempts
- Race condition vulnerabilities

---

## Conclusion

The application has a **solid security foundation** with proper use of modern frameworks and security best practices. The critical issue (weak token secret fallback) must be fixed before production deployment.

**Estimated Fix Time:** 15-30 minutes
**Risk After Fixes:** 🟢 LOW

**Next Steps:**
1. Implement critical fix (token secret)
2. Add rate limiting
3. Configure security headers
4. Perform staging environment testing
5. Deploy to production

---

**Questions?** Review this document before deploying to production.