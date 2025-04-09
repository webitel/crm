import { createFilterPresetsStore } from '@webitel/ui-datalist/presets';

export const useContactCaseFilterPresetsStore = (namespace) =>
  createFilterPresetsStore(namespace);
