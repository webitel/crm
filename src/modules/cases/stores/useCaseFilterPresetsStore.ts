import { createFilterPresetsStore } from '@webitel/ui-datalist/presets';

import { asPiniaStoreFactory } from '../../../app/store/asPiniaStoreFactory';

import { CasesNamespace as namespace } from '../namespace';

export const useCaseFilterPresetsStore = asPiniaStoreFactory(
	createFilterPresetsStore(namespace),
);
