import { ContactsAPI } from '@webitel/api-services/api';
import type { Contact } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { ContactsNamespace } from '../../namespace';
import { contactValidationSchema } from '../../validations/contact.validations';

export const useContactCardStore = createCardStore<Contact>({
	namespace: `${ContactsNamespace}/card`,
	apiModule: ContactsAPI,
	standardValidationSchema: contactValidationSchema,
});
