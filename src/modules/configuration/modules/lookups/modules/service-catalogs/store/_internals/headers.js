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
    value: 'sla',
    locale: 'lookups.slas.slas',
    show: true,
    field: 'sla',
    sort: SortSymbols.NONE,
  },
  {
    value: 'statuses',
    locale: 'lookups.serviceCatalogs.statuses',
    show: true,
    field: 'status',
    sort: SortSymbols.NONE,
  },
  {
    value: 'teams',
    locale: 'objects.team',
    show: true,
    field: 'teams',
  },
  {
    value: 'skills',
    locale: 'lookups.serviceCatalogs.skills',
    show: true,
    field: 'skills',
  },
  {
    value: 'state',
    locale: 'reusable.state',
    show: true,
    field: 'state',
    sort: SortSymbols.NONE,
  },
  {
    value: 'prefix',
    locale: 'lookups.serviceCatalogs.prefix',
    show: true,
    field: 'prefix',
    sort: SortSymbols.NONE,
  },
  {
    value: 'closeReasonGroup',
    locale: 'lookups.closeReasonGroups.closeReasonGroups',
    show: true,
    field: 'close_reason_group',
    sort: SortSymbols.NONE,
  },
  {
    value: 'description',
    locale: 'vocabulary.description',
    show: true,
    field: 'description',
    sort: SortSymbols.NONE,
  },
];
