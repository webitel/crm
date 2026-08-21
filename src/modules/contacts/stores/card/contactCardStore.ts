import { type ContactEntity, ContactsAPI } from '@webitel/api-services/api';
import { contactSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { ContactsNamespace } from '../../namespace';

export const useContactCardStore = createCardStore<ContactEntity>({
	namespace: `${ContactsNamespace}/card`,
	apiModule: ContactsAPI,
	standardValidationSchema,
});
