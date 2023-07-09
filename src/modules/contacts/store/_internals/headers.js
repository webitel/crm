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
    show: true,
    field: 'owner',
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
    value: 'label',
    locale: 'vocabulary.label',
    show: true,
    field: 'label',
    sort: SortSymbols.NONE,
  },
];
