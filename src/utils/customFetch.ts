export async function customFetch(url: string, options: RequestInit): Promise<Response> {
    const response = await fetch(url, options);
  if (response.status === 401) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }
  return response;
}
