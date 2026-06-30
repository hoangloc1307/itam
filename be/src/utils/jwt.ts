import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '~/configs';

export interface AccessTokenPayload {
  username: string;
}

export interface RefreshTokenPayload {
  username: string;
}

export function generateAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  } as SignOptions);
}

export function generateRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  } as SignOptions);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
