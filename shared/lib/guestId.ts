export function guestId(): string | null {
	if (typeof window === 'undefined') return null;

	const key = 'guest_user_id';

	try {
		let id = localStorage.getItem(key);

		if (!id) {
			id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
				? crypto.randomUUID()
				: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

			localStorage.setItem(key, id);
		}

		document.cookie = `${key}=${encodeURIComponent(id)}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
		return id;
	} catch {
		return null;
	}
}
