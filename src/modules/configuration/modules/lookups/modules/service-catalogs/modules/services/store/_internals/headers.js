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
    width: '300px',
    sort: SortSymbols.NONE,
  },
  {
    value: 'assignee',
    locale: 'lookups.contactGroups.assignee',
    show: true,
    field: 'assignee',
    sort: SortSymbols.NONE,
  },
  {
    value: 'group',
    locale: 'lookups.contactGroups.contactGroups',
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
