import { type Router, useRouter } from 'vue-router';
import { ErrorRedirectMap } from '../enems/ErrorRedirectMap.enum';

const HTTP_METHODS = {
	GET: 'get',
} as const;

//@author o.chorpita https://webitel.atlassian.net/browse/WTEL-8133
// Checks if this is an error loading an item
//onLoadErrorHandler is called only for loadItem() errors (GET request)
function isItemLoadRequest(err: unknown): boolean {
	const e = err as {
		config?: {
			method?: string;
		};
		request?: {
			method?: string;
		};
	};
	const method = (e?.config?.method ?? e?.request?.method ?? '').toLowerCase();
	return method === HTTP_METHODS.GET;
}

function getErrorStatus(err: unknown): number | undefined {
	const e = err as {
		status?: number;
		response?: {
			status?: number;
		};
	};
	return e?.status ?? e?.response?.status;
}

function redirectToErrorPage(router: Router, path: string) {
	router.replace(path);
}

export function useErrorRedirectHandler() {
	const router = useRouter();

	const handleError = (err: unknown) => {
		if (!err) return;

		const status = getErrorStatus(err);
		if (!status) return;

		// Check if there's a direct redirect for this status in the map
		const redirectPath =
			ErrorRedirectMap[status] ||
			(isItemLoadRequest(err) ? ErrorRedirectMap[404] : undefined);

		if (!redirectPath) return;

		redirectToErrorPage(router, redirectPath);
	};

	return {
		handleError,
	};
}
