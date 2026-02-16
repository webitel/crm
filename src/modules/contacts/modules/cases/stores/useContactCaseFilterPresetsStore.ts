import { createFilterPresetsStore } from '@webitel/ui-datalist/presets';

import { ContactCasesNamespace as namespace } from '../namespace.js';

export const useContactCaseFilterPresetsStore =
	createFilterPresetsStore(namespace);
