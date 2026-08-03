import { ContactsAPI } from '@webitel/api-services/api';
import {
	type Contact,
	contactSchema as standardValidationSchema,
} from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { ContactsNamespace } from '../../namespace';

export const useContactCardStore = createCardStore<Contact>({
	namespace: `${ContactsNamespace}/card`,
	apiModule: ContactsAPI,
	standardValidationSchema,
});
