import {
	createFilterConfig,
	type FilterConfigDefinition,
	FilterOption,
} from '@webitel/ui-datalist/filters';

export const filterConfigs = {
	[FilterOption.ContactGroup]: createFilterConfig({
		name: FilterOption.ContactGroup,
		hideUnassigned: true,
	}),
	[FilterOption.ContactOwner]: FilterOption.ContactOwner,
	[FilterOption.ContactLabel]: FilterOption.ContactLabel,
	[FilterOption.HasUser]: FilterOption.HasUser,
} satisfies Record<string, FilterConfigDefinition>;

export const filtersOptions: FilterConfigDefinition[] =
	Object.values(filterConfigs);
