export function getOrCreateGuestCartToken(): string | null {
  if (typeof window === 'undefined') return null;
  const key = 'guest_cart_token';
  try {
    let token = localStorage.getItem(key);
    if (!token) {
      // Prefer native UUID if available
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      token = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? // @ts-ignore
          crypto.randomUUID()
        : `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      localStorage.setItem(key, token);
      // also set a cookie for server-side access if needed
      document.cookie = `${key}=${token}; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
    return token;
  } catch (e) {
    return null;
  }
}
