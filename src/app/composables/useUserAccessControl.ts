import { createUserAccessControlComposable } from '@webitel/ui-sdk/modules/Userinfo';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// biome-ignore-start lint/suspicious/noExplicitAny: stub signature replaced at runtime by createUserAccessControlComposable, callers rely on `any` for destructuring access fields
export let useUserAccessControl = (_?: any): any => {
	throw new Error('useUserAccessControl is not created');
};
// biome-ignore-end lint/suspicious/noExplicitAny: stub signature

export const createUserAccessControl = (useUserinfoStore) => {
	useUserAccessControl = createUserAccessControlComposable(useUserinfoStore);
	return useUserAccessControl;
};
