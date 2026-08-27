import { ContactsAPI } from '@webitel/api-services/api';
import type { WebitelContactsContact } from '@webitel/api-services/gen/models';
import { contactSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { ContactsNamespace } from '../../namespace';

export const useContactCardStore = createCardStore<WebitelContactsContact>({
	namespace: `${ContactsNamespace}/card`,
	apiModule: ContactsAPI,
	standardValidationSchema,
});
