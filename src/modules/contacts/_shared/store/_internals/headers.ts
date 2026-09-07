import type { DatalistTableHeader } from '@webitel/ui-datalist';
import { FilterOption } from '@webitel/ui-datalist/filters';
import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export const headers: DatalistTableHeader[] = [
	{
		value: 'name',
		locale: 'reusable.name',
		show: true,
		field: 'name',
		sort: SortSymbols.NONE,
	},
	{
		value: 'user',
		locale: [
			'objects.user',
			1,
		],
		show: true,
		field: 'user',
		width: '100px',
		filter: FilterOption.HasUser,
	},
	{
		value: 'groups',
		locale: 'reusable.group',
		show: true,
		field: 'groups',
		width: '170px',
		filter: FilterOption.ContactGroup,
	},
	{
		value: 'labels',
		locale: [
			'vocabulary.labels',
			1,
		],
		show: true,
		field: 'labels',
		filter: FilterOption.ContactLabel,
	},
	{
		value: 'managers',
		locale: [
			'contacts.manager',
			1,
		],
		show: true,
		field: 'managers',
		sort: SortSymbols.NONE,
		filter: FilterOption.ContactOwner,
	},
	{
		value: 'about',
		locale: 'vocabulary.description',
		show: true,
		field: 'about',
		sort: SortSymbols.NONE,
	},
];
