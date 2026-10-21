import { ContactsAPI } from '@webitel/api-services/api';
import { createPermissionsStore } from '@webitel/ui-datalist/permissions';

import { ContactsNamespace } from '../../namespace';

export const useContactPermissionsStore = createPermissionsStore(
	`${ContactsNamespace}/permissions`,
	{
		apiModule: ContactsAPI,
	},
);
