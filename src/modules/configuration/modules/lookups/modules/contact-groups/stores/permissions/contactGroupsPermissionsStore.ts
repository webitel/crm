import { ContactGroupsAPI } from '@webitel/api-services/api';
import { createPermissionsStore } from '@webitel/ui-datalist/permissions-page';

import { ContactGroupsNamespace } from '../../namespace';

export const useContactGroupsPermissionsStore = createPermissionsStore(
	`${ContactGroupsNamespace}/permissions`,
	{
		apiModule: ContactGroupsAPI,
	},
);
