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
    value: 'owner',
    locale: 'locale for owner',
    show: false,
    field: 'managers',
    sort: SortSymbols.NONE,
  },
  {
    value: 'labels',
    locale: ['vocabulary.labels', 1],
    show: true,
    field: 'labels',
    sort: SortSymbols.NONE,
  },
  {
    value: 'about',
    locale: 'vocabulary.description',
    show: true,
    field: 'about',
    sort: SortSymbols.NONE,
  },
];
