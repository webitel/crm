import {
	createFilterConfig,
	FilterConfigDefinition,
	FilterOption,
} from '@webitel/ui-datalist/filters';

export const filtersOptions: FilterConfigDefinition[] = [
	createFilterConfig({
		name: FilterOption.ContactGroup,
		hideUnassigned: true,
	}),
	FilterOption.ContactOwner,
	FilterOption.ContactLabel,
	FilterOption.HasUser,
];
