/**
 * Password Utility Tests
 * Unit tests for password hashing and validation utilities
 */

import { PasswordUtils } from '../../src/utils/password';

describe('PasswordUtils', () => {
  describe('hashPassword', () => {
    it('should hash a password successfully', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await PasswordUtils.hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'TestPassword123!';
      const hash1 = await PasswordUtils.hashPassword(password);
      const hash2 = await PasswordUtils.hashPassword(password);
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await PasswordUtils.hashPassword(password);
      
      const isValid = await PasswordUtils.verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hashedPassword = await PasswordUtils.hashPassword(password);
      
      const isValid = await PasswordUtils.verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });
  });

  describe('generateRandomPassword', () => {
    it('should generate password with default length', () => {
      const password = PasswordUtils.generateRandomPassword();
      expect(password.length).toBe(12);
    });

    it('should generate password with custom length', () => {
      const length = 16;
      const password = PasswordUtils.generateRandomPassword(length);
      expect(password.length).toBe(length);
    });

    it('should generate different passwords each time', () => {
      const password1 = PasswordUtils.generateRandomPassword();
      const password2 = PasswordUtils.generateRandomPassword();
      expect(password1).not.toBe(password2);
    });
  });

  describe('validatePasswordStrength', () => {
    it('should accept strong password', () => {
      const result = PasswordUtils.validatePasswordStrength('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password that is too short', () => {
      const result = PasswordUtils.validatePasswordStrength('Short1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });

    it('should reject password without lowercase letter', () => {
      const result = PasswordUtils.validatePasswordStrength('PASSWORD123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without uppercase letter', () => {
      const result = PasswordUtils.validatePasswordStrength('password123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without number', () => {
      const result = PasswordUtils.validatePasswordStrength('Password!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special character', () => {
      const result = PasswordUtils.validatePasswordStrength('Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });
  });
});