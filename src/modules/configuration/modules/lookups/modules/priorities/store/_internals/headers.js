import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
  {
    value: 'name',
    locale: 'reusable.name',
    show: true,
    field: 'name',
    sort: SortSymbols.ASC,
  },
  {
    value: 'description',
    locale: 'vocabulary.description',
    show: true,
    field: 'description',
    sort: SortSymbols.ASC,
  },
  {
    value: 'color',
    locale: 'lookups.priorities.color',
    show: true,
    field: 'color',
    sort: SortSymbols.ASC,
  },
];
