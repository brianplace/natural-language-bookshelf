import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:3001';

let authToken: string | null = null;

export function setToken(token: string) {
    authToken = token;
}

export function getToken(): string | null {
    return authToken;
}

export async function apiCall(
    method: 'get' | 'post' | 'patch' | 'delete',
    path: string,
    data?: any,
) {
    const maxRetries = 5;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await axios({
                method,
                url: `${API_URL}${path}`,
                data,
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            });
            return response.data;
        } catch (err: any) {
            const status = err.response?.status;
            const isWakingUp = status === 429 || status === 503 || !status; // no status = connection refused/timeout
            if (attempt < maxRetries && isWakingUp) {
                await new Promise(resolve => setTimeout(resolve, 5000));
                continue;
            }
            throw err;
        }
    }
}
