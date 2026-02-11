import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
	{
		value: 'primary',
		show: true,
		field: 'primary',
		width: '24px',
		sort: SortSymbols.NONE,
	},
	{
		value: 'number',
		locale: [
			'vocabulary.phones',
			1,
		],
		show: true,
		field: 'number',
		sort: SortSymbols.NONE,
	},
	{
		value: 'type',
		locale: [
			'objects.communicationType',
			1,
		],
		show: true,
		field: 'type',
		sort: SortSymbols.NONE,
	},
];
