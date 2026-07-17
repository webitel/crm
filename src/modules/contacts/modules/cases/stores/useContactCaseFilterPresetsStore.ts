import { createFilterPresetsStore } from '@webitel/ui-datalist/presets';

import { asPiniaStoreFactory } from '../../../../../app/store/asPiniaStoreFactory';
import { ContactCasesNamespace as namespace } from '../namespace.js';

export const useContactCaseFilterPresetsStore = asPiniaStoreFactory(
	createFilterPresetsStore(namespace),
);
