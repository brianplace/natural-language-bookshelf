import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { signToken } from '../lib/jwt';

const router = Router();

function validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    const checks = [
        { met: /[A-Z]/.test(password), label: 'uppercase letter' },
        { met: /[a-z]/.test(password), label: 'lowercase letter' },
        { met: /[0-9]/.test(password), label: 'number' },
        { met: /[^A-Za-z0-9]/.test(password), label: 'special character' },
    ];

    const unmet = checks.filter(c => !c.met);
    if (unmet.length > 1) {
        errors.push(`Password must contain at least 3 of the following: uppercase letter, lowercase letter, number, special character. Missing: ${unmet.map(c => c.label).join(', ')}`);
    }

    return { valid: errors.length === 0, errors };
}

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ errors: ['Email and password are required'] });
            return;
        }

        const { valid, errors } = validatePassword(password);
        if (!valid) {
            res.status(400).json({ errors });
            return;
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(409).json({ errors: ['Email already in use'] });
            return;
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashed },
        });

        const token = signToken(user.id);
        res.status(201).json({ data: { token } });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ errors: ['Failed to register'] });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = signToken(user.id);
        res.json({ data: { token } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});

export default router;
