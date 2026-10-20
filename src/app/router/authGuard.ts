import type { RouteLocationNormalized } from 'vue-router';

export const createAuthGuard =
	({ onUnauthorized = () => {} } = {}) =>
	(to: RouteLocationNormalized) => {
		// [https://webitel.atlassian.net/browse/WTEL-10705]
		// only the stored token counts: `?accessToken=` is never trusted
		if (!localStorage.getItem('access-token')) {
			// @author @Lear24
			// remove flag about shown notifications from localStorage
			onUnauthorized();
			const desiredUrl = encodeURIComponent(window.location.href);
			const authUrl = import.meta.env.VITE_AUTH_URL;
			window.location.href = `${authUrl}?redirectTo=${desiredUrl}`;
		} else if (to.query.accessToken) {
			// old links may still carry the token: drop it from the url
			const newQuery = {
				...to.query,
			};
			delete newQuery.accessToken;
			return {
				...to,
				query: newQuery,
			};
		}
		return true;
	};
