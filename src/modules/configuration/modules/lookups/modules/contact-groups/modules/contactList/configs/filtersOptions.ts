import {
  createFilterConfig,
  FilterConfigDefinition,
  FilterOption,
} from '@webitel/ui-datalist/filters';

export const filtersOptions: FilterConfigDefinition[] = [
  createFilterConfig({
    name: FilterOption.ContactGroup,
    hideUnassigned: true,
    noValidation: true,
    hideLabel: true,
  }),
  createFilterConfig({
    name: FilterOption.HasUser,
    noValidation: true,
    hideLabel: true,
  }),
  createFilterConfig({
    name: FilterOption.ContactLabel,
    noValidation: true,
    hideLabel: true,
  }),
];
