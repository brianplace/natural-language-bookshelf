import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { signToken } from '../lib/jwt';

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

export async function register(email: string, password: string): Promise<{ token: string }> {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const { valid, errors } = validatePassword(password);
    if (!valid) {
        throw new Error(errors.join('; '));
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        throw new Error('Email already in use');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashed },
    });

    const token = signToken(user.id);
    return { token };
}

export async function login(email: string, password: string): Promise<{ token: string }> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        throw new Error('Invalid credentials');
    }

    const token = signToken(user.id);
    return { token };
}
