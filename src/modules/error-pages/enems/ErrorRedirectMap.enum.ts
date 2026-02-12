export const ErrorRedirectMap = {
	404: '/404',
};

export type ErrorRedirectMapType =
	(typeof ErrorRedirectMap)[keyof typeof ErrorRedirectMap];
