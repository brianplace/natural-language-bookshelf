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
    const maxRetries = 12;
    let coldStart = false;
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
            if (attempt === 0) {
                try {
                    await axios({ method: 'get', url: API_URL });
                } catch {
                    // Service unreachable — likely a cold start
                    coldStart = true;
                }
            }

            const status = err.response?.status;
            // Treat 429 as cold-start only if the service was also unreachable on
            // the first attempt; otherwise it's a real rate limit and we should fail fast.
            const isWakingUp = status === 503 || !status || (status === 429 && coldStart);
            if (attempt < maxRetries && isWakingUp) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                continue;
            }
            throw err;
        }
    }
}
