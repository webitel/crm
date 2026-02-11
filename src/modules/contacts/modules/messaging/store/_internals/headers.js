import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
	{
		value: 'icon',
		show: true,
		width: '24px',
	},
	{
		value: 'protocol',
		locale: 'contacts.communications.messaging.provider',
		show: true,
		field: 'protocol',
		sort: SortSymbols.NONE,
	},
	{
		value: 'app',
		locale: 'contacts.communications.messaging.gateway',
		show: true,
		field: 'app',
		sort: SortSymbols.NONE,
	},
	{
		value: 'user',
		locale: 'contacts.communications.messaging.username',
		show: true,
		field: 'user',
		sort: SortSymbols.NONE,
	},
];
