import { ContactsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { headers } from '../../_shared/store/_internals/headers';
import { ContactsNamespace } from '../../namespace';
import { mapContactListFields } from '../../utils/mapContactListFields';

export const useContactsDatalistStore = createTableStore(
	`${ContactsNamespace}/datalist`,
	{
		apiModule: {
			...ContactsAPI,
			getList: (params) => {
				const listParams = (params ?? {}) as {
					fields?: string[];
				};
				return ContactsAPI.getList({
					...listParams,
					fields: mapContactListFields(listParams.fields),
				});
			},
		},
		headers,
	},
);
