import argon2 from 'argon2';
import crypto from 'crypto';

export function generateRandomPassword(length = 10): string {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
}

export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain);
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  return argon2.verify(hash, plain);
}
