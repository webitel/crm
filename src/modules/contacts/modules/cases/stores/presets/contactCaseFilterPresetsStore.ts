import { createFilterPresetsStore } from '@webitel/ui-datalist/presets';

import { ContactCasesNamespace as namespace } from '../../namespace';

export const useContactCaseFilterPresetsStore =
	createFilterPresetsStore(namespace);
