import {
	createFilterConfig,
	type FilterConfigDefinition,
	FilterOption,
} from '@webitel/ui-datalist/filters';

export const contactGroupFilterConfig = createFilterConfig({
	name: FilterOption.ContactGroup,
	hideUnassigned: true,
});

export const filtersOptions: FilterConfigDefinition[] = [
	contactGroupFilterConfig,
	FilterOption.ContactOwner,
	FilterOption.ContactLabel,
	FilterOption.HasUser,
];
