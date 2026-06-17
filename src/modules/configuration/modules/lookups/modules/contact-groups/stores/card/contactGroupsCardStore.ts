import type { ContactsGroup } from '@webitel/api-services/gen/models';
import { contactGroupSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { ContactGroupsNamespace } from '../../namespace';
import { ContactGroupsAPI } from '@webitel/api-services/api';
export const useContactGroupsCardStore = createCardStore<ContactsGroup>({
	namespace: `${ContactGroupsNamespace}/card`,
	apiModule: ContactGroupsAPI,
	standardValidationSchema,
});
