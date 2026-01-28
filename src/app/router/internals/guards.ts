import { WtApplication } from '@webitel/ui-sdk/enums';

import { useUserinfoStore } from '../../../modules/userinfo/store/userinfoStore';

export const checkAppAccess = () => {
  const userInfoStore = useUserinfoStore()

  const hasReadAccess = userInfoStore.hasApplicationVisibility(WtApplication.Crm)
  if (hasReadAccess) {
    return true;
  } else {
    return { path: '/access-denied' };
  }
};
