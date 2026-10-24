export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

type ApiOptions = RequestInit & { token?: string };

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, headers, ...requestOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiRequest<{ access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: Record<string, string>) =>
    apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
};

export const projectApi = {
  analyzePlan: (fileId: string, token?: string) =>
    apiRequest('/plans/analyze', { method: 'POST', body: JSON.stringify({ fileId }), token }),
  recommendations: (roomId: string, token?: string) =>
    apiRequest(`/rooms/${roomId}/recommendations`, { token }),
  createBudget: (payload: unknown, token?: string) =>
    apiRequest('/budgets', { method: 'POST', body: JSON.stringify(payload), token }),
};
