import { createUserAccessControlComposable } from '@webitel/ui-sdk/modules/Userinfo';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export let useUserAccessControl = (_?: any): any => {
	throw new Error('useUserAccessControl is not created');
};

export const createUserAccessControl = (useUserinfoStore) => {
	useUserAccessControl = createUserAccessControlComposable(useUserinfoStore);
	return useUserAccessControl;
};
