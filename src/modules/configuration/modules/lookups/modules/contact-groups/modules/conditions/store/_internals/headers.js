import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
	{
		value: 'expression',
		locale: 'lookups.slas.conditions',
		show: true,
		field: 'expression',
		sort: SortSymbols.NONE,
	},
	{
		value: 'group',
		locale: 'lookups.contactGroups.contactGroups',
		show: true,
		field: 'group',
		sort: SortSymbols.NONE,
	},
	{
		value: 'assignee',
		locale: 'lookups.contactGroups.assignee',
		show: true,
		field: 'assignee',
		sort: SortSymbols.NONE,
	},
];
