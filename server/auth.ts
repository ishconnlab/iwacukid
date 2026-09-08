import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { db } from './db.js';
import { AdminRole } from './types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'iwacu-kids-secret-key-rwanda-2026';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
  phone?: string;
  exp: number;
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha512').update(password + JWT_SECRET).digest('hex');
}

export function signTokenFor(payload: Omit<AuthTokenPayload, 'exp'>): string {
  const full: AuthTokenPayload = {
    ...payload,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const body = Buffer.from(JSON.stringify(full)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(body)
    .digest('base64url');
  return `${body}.${signature}`;
}

export function verifyToken(tokenString: string): AuthTokenPayload | null {
  try {
    const [body, signature] = tokenString.split('.');
    if (!body || !signature) return null;

    const expectedSig = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(body)
      .digest('base64url');

    if (signature !== expectedSig) return null;

    const payload: AuthTokenPayload = JSON.parse(
      Buffer.from(body, 'base64url').toString('utf-8')
    );
    if (payload.exp < Date.now()) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function requireAuth(roles: AdminRole[] = ['SUPER_ADMIN', 'ADMIN', 'STAFF', 'CUSTOMER']) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication token required' });
      return;
    }

    const token = authHeader.substring(7);
    const user = verifyToken(token);
    if (!user) {
      res.status(401).json({ error: 'Invalid or expired session token' });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ error: 'Insufficient permissions for this resource' });
      return;
    }

    req.user = user;
    next();
  };
}

export async function loadFullUser(payload: AuthTokenPayload) {
  if (payload.role === 'CUSTOMER') {
    return db.getCustomerById(payload.userId);
  }
  return db.getUserById(payload.userId);
}