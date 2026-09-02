import { ContactsAPI } from '@webitel/api-services/api';
import type { WebitelContactsContact } from '@webitel/api-services/gen/models';
import { createCardStore } from '@webitel/ui-datalist/card';

import { ContactsNamespace } from '../../namespace';
import { contactValidationSchema } from '../../validations/contact.validations';

export const useContactCardStore = createCardStore<WebitelContactsContact>({
	namespace: `${ContactsNamespace}/card`,
	apiModule: ContactsAPI,
	standardValidationSchema: contactValidationSchema as any,
});
