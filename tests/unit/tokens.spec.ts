import { describe, it, expect } from 'vitest';
import {
  generateParticipationToken,
  generateSignedToken,
  validateSignedToken,
  isTokenExpired,
  generateEventCode,
} from '@/lib/tokens';

describe('Token Utilities', () => {
  describe('generateParticipationToken', () => {
    it('should generate a valid UUID token', () => {
      const token = generateParticipationToken();
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(token).toMatch(uuidRegex);
    });

    it('should generate unique tokens', () => {
      const token1 = generateParticipationToken();
      const token2 = generateParticipationToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('generateSignedToken', () => {
    it('should generate a signed token with signature', () => {
      const token = generateSignedToken('test-payload');
      expect(token).toContain('.');
      const [uuid, signature] = token.split('.');
      expect(uuid).toBeTruthy();
      expect(signature).toBeTruthy();
      expect(signature).toHaveLength(64); // SHA256 hex length
    });

    it('should generate different tokens for same payload', () => {
      const token1 = generateSignedToken('payload');
      const token2 = generateSignedToken('payload');
      expect(token1).not.toBe(token2);
    });
  });

  describe('validateSignedToken', () => {
    it('should validate a correctly signed token', () => {
      const payload = 'test-payload';
      const token = generateSignedToken(payload);
      const isValid = validateSignedToken(token, payload);
      expect(isValid).toBe(true);
    });

    it('should reject token with wrong payload', () => {
      const token = generateSignedToken('original-payload');
      const isValid = validateSignedToken(token, 'wrong-payload');
      expect(isValid).toBe(false);
    });

    it('should reject tampered token', () => {
      const token = generateSignedToken('payload');
      const tampered = token.replace(/a/g, 'b');
      const isValid = validateSignedToken(tampered, 'payload');
      expect(isValid).toBe(false);
    });

    it('should reject malformed token', () => {
      const isValid = validateSignedToken('not-a-valid-token', 'payload');
      expect(isValid).toBe(false);
    });

    it('should reject token without signature', () => {
      const isValid = validateSignedToken('token-without-dot', 'payload');
      expect(isValid).toBe(false);
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for fresh token', () => {
      const tokenDate = new Date();
      const expired = isTokenExpired(tokenDate, 30);
      expect(expired).toBe(false);
    });

    it('should return true for expired token', () => {
      const tokenDate = new Date();
      tokenDate.setDate(tokenDate.getDate() - 31); // 31 days ago
      const expired = isTokenExpired(tokenDate, 30);
      expect(expired).toBe(true);
    });

    it('should return false for token at expiry boundary', () => {
      const tokenDate = new Date();
      tokenDate.setDate(tokenDate.getDate() - 30); // exactly 30 days ago
      const expired = isTokenExpired(tokenDate, 30);
      expect(expired).toBe(false);
    });

    it('should respect custom expiry days', () => {
      const tokenDate = new Date();
      tokenDate.setDate(tokenDate.getDate() - 8); // 8 days ago
      const expired = isTokenExpired(tokenDate, 7);
      expect(expired).toBe(true);
    });
  });

  describe('generateEventCode', () => {
    it('should generate an 8-character uppercase code', () => {
      const code = generateEventCode();
      expect(code).toHaveLength(8);
      expect(code).toMatch(/^[A-F0-9]{8}$/);
    });

    it('should generate unique codes', () => {
      const code1 = generateEventCode();
      const code2 = generateEventCode();
      expect(code1).not.toBe(code2);
    });
  });
});