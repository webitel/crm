import { EmailsAPI } from '@webitel/api-services/api';
import { createTableStore } from '@webitel/ui-datalist';

import { CommunicationsNamespace } from '../../../../namespace';
import { headers } from './_internals/headers';

export const useEmailsDatalistStore = createTableStore(
	`${CommunicationsNamespace}/emails/datalist`,
	{
		apiModule: EmailsAPI,
		headers,
	},
);
