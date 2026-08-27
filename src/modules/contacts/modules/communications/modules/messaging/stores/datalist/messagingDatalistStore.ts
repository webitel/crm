import { IMClientsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CommunicationsNamespace } from '../../../../namespace';
import { headers } from './_internals/headers';

export const useMessagingDatalistStore = createTableStore(
	`${CommunicationsNamespace}/messaging/datalist`,
	{
		apiModule: IMClientsAPI,
		headers,
	},
);
