import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export default [
  // TODO Implement another columns after finished created service https://webitel.atlassian.net/browse/WTEL-5658
  {
    value: 'name',
    locale: 'reusable.name',
    show: true,
    field: 'name',
    sort: SortSymbols.NONE,
  },
  {
    value: 'code',
    locale: 'lookups.serviceCatalogs.code',
    show: true,
    field: 'code',
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
    value: 'assignee',
    locale: 'lookups.serviceCatalogs.assignee',
    show: true,
    field: 'assignee',
    sort: SortSymbols.NONE,
  },
  {
    value: 'group',
    locale: 'lookups.serviceCatalogs.group',
    show: true,
    field: 'group',
    sort: SortSymbols.NONE,
  },
  {
    value: 'state',
    locale: 'reusable.state',
    show: true,
    field: 'state',
    sort: SortSymbols.NONE,
  },
];
