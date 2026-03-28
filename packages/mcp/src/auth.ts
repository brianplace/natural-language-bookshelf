import { verifyToken } from './lib/jwt';

let authToken: string | null = null;

export function setToken(token: string) {
    authToken = token;
}

export function getToken(): string | null {
    return authToken;
}

export function clearToken() {
    authToken = null;
}

export function getUserId(): string {
    if (!authToken) {
        throw new Error('Not authenticated. Use the Login tool first.');
    }
    const { userId } = verifyToken(authToken);
    return userId;
}
