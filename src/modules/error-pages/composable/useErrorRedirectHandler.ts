import { useRouter } from 'vue-router';
import { ErrorRedirectMap } from '../enems/ErrorRedirectMap.enum';

export function useErrorRedirectHandler() {
	const router = useRouter();

	const handleError = (err: any) => {
		const status = err?.status ?? err?.response?.status;
		const to = ErrorRedirectMap[status];
		if (to) return router.push(to);
	};

	return {
		handleError,
	};
}
