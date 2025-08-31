const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true';
const API_BASE_URL = USE_REAL_API ? 'http://localhost:3001' : '';

/**
 * A centralized API client for the frontend.
 * It prepends the correct base URL depending on the environment.
 * It also handles adding the Authorization header for authenticated requests.
 *
 * @param path The API path (e.g., /api/products)
 * @param options The standard options for a fetch call
 * @returns The response from the fetch call
 */
export const apiClient = (path: string, options: RequestInit = {}): Promise<Response> => {
  const url = `${API_BASE_URL}${path}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt_token') : null;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.append('Content-Type', 'application/json');
  }
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
