import { ContactsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { AddContactsInGroupNamespace } from '../../namespace';
import { headers } from '../_internals/headers';

export const createAddContactsInGroupDatalistStore = () =>
	createTableStore(`${AddContactsInGroupNamespace}/datalist`, {
		apiModule: ContactsAPI,
		headers,
		isAppendDataList: true,
		disablePersistence: true,
		storeType: 'composable',
	});
