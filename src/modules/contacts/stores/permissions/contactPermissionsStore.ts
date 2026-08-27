import { ContactsAPI } from '@webitel/api-services/api';
import { createPermissionsStore } from '@webitel/ui-datalist/permissions-page';

import { ContactsNamespace } from '../../namespace';

export const useContactPermissionsStore = createPermissionsStore(
	`${ContactsNamespace}/permissions`,
	{
		apiModule: ContactsAPI,
	},
);
