import * as bcrypt from 'bcryptjs';
import * as SecureStore from 'expo-secure-store';
import { db } from './database';
import { validatePin, validatePinSetup } from './authValidation';

const PIN_HASH_KEY = 'pin_hash';
const BIOMETRIC_KEY = 'biometric_enabled';
const BCRYPT_SALT_ROUNDS = 12;

export interface AuthConfig {
  biometricEnabled: boolean;
  failedAttempts: number;
  lockedUntil: number | null;
  createdAt: number;
}

export class AuthService {
  private sessionToken: string | null = null;

  generateSessionToken(): string {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
  }

  setSessionToken(token: string): void {
    this.sessionToken = token;
  }

  getSessionToken(): string | null {
    return this.sessionToken;
  }

  clearSessionToken(): void {
    this.sessionToken = null;
  }

  isAuthenticated(): boolean {
    return this.sessionToken !== null;
  }

  async hashPin(pin: string): Promise<string> {
    const validation = validatePin(pin);
    if (!validation.valid) {
      throw new Error(validation.error ?? 'Invalid PIN.');
    }

    return bcrypt.hash(pin.trim(), BCRYPT_SALT_ROUNDS);
  }

  async verifyPin(pin: string, hash: string): Promise<boolean> {
    const validation = validatePin(pin);
    if (!validation.valid || !hash) {
      return false;
    }

    const normalizedPin = pin.trim();
    if (this.isBcryptHash(hash)) {
      return bcrypt.compare(normalizedPin, hash);
    }

    return normalizedPin === hash;
  }

  async storePinHash(hash: string): Promise<void> {
    await SecureStore.setItemAsync(PIN_HASH_KEY, hash);
  }

  async getPinHash(): Promise<string | null> {
    return SecureStore.getItemAsync(PIN_HASH_KEY);
  }

  async deletePinHash(): Promise<void> {
    await SecureStore.deleteItemAsync(PIN_HASH_KEY);
  }

  async storeBiometricEnabled(enabled: boolean): Promise<void> {
    await SecureStore.setItemAsync(BIOMETRIC_KEY, enabled ? 'true' : 'false');
  }

  async getBiometricEnabled(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(BIOMETRIC_KEY);
    return value === 'true';
  }

  async deleteBiometricEnabled(): Promise<void> {
    await SecureStore.deleteItemAsync(BIOMETRIC_KEY);
  }

  async getAuthConfig(): Promise<AuthConfig | null> {
    const config = await db.getAuthConfig();
    if (!config) {
      return null;
    }

    return {
      biometricEnabled: config.biometricEnabled,
      failedAttempts: config.failedAttempts,
      lockedUntil: config.lockedUntil,
      createdAt: config.createdAt,
    };
  }

  async hasPinConfigured(): Promise<boolean> {
    return (await this.getPinHash()) !== null;
  }

  async updateAuthConfig(config: Partial<AuthConfig>): Promise<void> {
    await db.setAuthConfig({
      biometricEnabled: config.biometricEnabled,
      failedAttempts: config.failedAttempts,
      lockedUntil: config.lockedUntil,
    });
  }

  async deleteAuthConfig(): Promise<void> {
    await db.deleteAuthConfig();
    await this.deletePinHash();
    await this.deleteBiometricEnabled();
  }

  async skipAuthSetup(): Promise<void> {
    await this.deletePinHash();
    await this.storeBiometricEnabled(false);
    await this.updateAuthConfig({
      biometricEnabled: false,
      failedAttempts: 0,
      lockedUntil: null,
    });
  }

  async setupAuth(pin: string, enableBiometric: boolean = false): Promise<void> {
    const validation = validatePinSetup(pin, pin);
    if (!validation.valid) {
      throw new Error(validation.error ?? 'Invalid PIN.');
    }

    const hash = await this.hashPin(pin);
    await this.storePinHash(hash);
    await this.storeBiometricEnabled(enableBiometric);
    await this.updateAuthConfig({
      biometricEnabled: enableBiometric,
      failedAttempts: 0,
      lockedUntil: null,
    });
  }

  async isSetupComplete(): Promise<boolean> {
    return this.hasPinConfigured();
  }

  async verifyStoredPin(pin: string): Promise<boolean> {
    const storedHash = await this.getPinHash();
    if (!storedHash) {
      return false;
    }

    const isValid = await this.verifyPin(pin, storedHash);
    if (isValid && !this.isBcryptHash(storedHash)) {
      const upgradedHash = await this.hashPin(pin);
      await this.storePinHash(upgradedHash);
    }

    return isValid;
  }

  async incrementFailedAttempts(): Promise<void> {
    const config = await this.getAuthConfig();
    if (!config) {
      return;
    }

    await this.updateAuthConfig({ failedAttempts: config.failedAttempts + 1 });
  }

  async resetFailedAttempts(): Promise<void> {
    await this.updateAuthConfig({ failedAttempts: 0, lockedUntil: null });
  }

  async lockAccount(durationMs: number): Promise<void> {
    await this.updateAuthConfig({
      failedAttempts: 0,
      lockedUntil: Date.now() + durationMs,
    });
  }

  isLocked(lockedUntil: number | null): boolean {
    return lockedUntil !== null && Date.now() < lockedUntil;
  }

  getLockoutTimeRemaining(lockedUntil: number | null): number {
    if (!lockedUntil) {
      return 0;
    }

    return Math.max(0, lockedUntil - Date.now());
  }

  private isBcryptHash(value: string): boolean {
    return /^\$2[aby]\$\d{2}\$/.test(value);
  }
}

export const authService = new AuthService();
export default authService;
