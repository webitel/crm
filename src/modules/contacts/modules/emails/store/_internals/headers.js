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
    value: 'email',
    locale: ['vocabulary.emails', 1],
    show: true,
    field: 'email',
    sort: SortSymbols.NONE,
  },
  {
    value: 'type',
    locale: ['objects.communicationType', 1],
    show: true,
    field: 'type',
    sort: SortSymbols.NONE,
  },
];
