import { PhonesAPI } from '@webitel/api-services/api';
import type { ContactsPhoneNumber } from '@webitel/api-services/gen/models';
import { contactPhoneSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CommunicationsNamespace } from '../../../../namespace';

export const usePhonesCardStore = createCardStore<ContactsPhoneNumber>({
	namespace: `${CommunicationsNamespace}/phones/card`,
	apiModule: PhonesAPI,
	standardValidationSchema,
});
