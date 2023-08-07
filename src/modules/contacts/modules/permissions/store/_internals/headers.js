import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
  {
    value: 'grantee',
    locale: 'reusable.name',
    field: 'grantee',
    sort: SortSymbols.NONE,
  },
  {
    value: 'read',
    locale: 'permissions.read',
    field: 'r',
    sort: SortSymbols.NONE,
  },
  {
    value: 'edit',
    locale: 'permissions.edit',
    field: 'w',
    sort: SortSymbols.NONE,
  },
  {
    value: 'delete',
    locale: 'permissions.delete',
    field: 'd',
    sort: SortSymbols.NONE,
  },
];
