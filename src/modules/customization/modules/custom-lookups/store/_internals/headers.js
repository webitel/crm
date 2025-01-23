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
    value: 'createdAt',
    locale: 'reusable.createdAt',
    show: true,
    field: 'created_at',
    sort: SortSymbols.NONE,
  },
  {
    value: 'createdBy',
    locale: 'reusable.createdBy',
    show: true,
    field: 'created_by',
    sort: SortSymbols.NONE,
  },
];
