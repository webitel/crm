import type {
  UseUserAccessControlComposableOptions
} from '@webitel/ui-sdk/composables/useAccessControl/v2/types/CreateUserAccessControl';
import { createUserAccessControlComposable } from '@webitel/ui-sdk/src/composables/useAccessControl/v2/createUserAccessControl';
import type { UseAccessControlReturn } from '@webitel/ui-sdk/src/composables/useAccessControl/v2/types/CreateUserAccessControl';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export let useUserAccessControl = (_?: UseUserAccessControlComposableOptions): UseAccessControlReturn => {
  throw new Error('useUserAccessControl is not created');
};

export const createUserAccessControl = (useUserinfoStore) => {
  useUserAccessControl = createUserAccessControlComposable(useUserinfoStore);
  return useUserAccessControl;
};
