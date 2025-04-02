import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
  {
    value: 'name',
    locale: 'reusable.name',
    show: true,
    field: 'name',
    sort: SortSymbols.NONE,
  },
  {
    value: 'description',
    locale: 'vocabulary.description',
    show: true,
    field: 'description',
    sort: SortSymbols.NONE,
  },
  {
    value: 'calendar',
    locale: 'objects.calendar',
    show: true,
    field: 'calendar',
    sort: SortSymbols.NONE,
  },
];
