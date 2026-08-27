import { EmailsAPI } from '@webitel/api-services/api';
import type { ContactsEmailAddress } from '@webitel/api-services/gen/models';
import { contactEmailSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CommunicationsNamespace } from '../../../../namespace';

export const useEmailsCardStore = createCardStore<ContactsEmailAddress>({
	namespace: `${CommunicationsNamespace}/emails/card`,
	apiModule: EmailsAPI,
	standardValidationSchema,
});
