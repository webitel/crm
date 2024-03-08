import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
  {
    value: 'id',
    show: true,
    width: '30px',
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
];
