import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

export interface AuthRequest extends Request {
    userId?: string;
}

export function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const token = header.split(' ')[1];
        const { userId } = verifyToken(token);
        req.userId = userId;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}
