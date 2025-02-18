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
    value: 'user',
    locale: ['objects.user', 1],
    show: true,
    field: 'user',
    sort: SortSymbols.NONE,
  },
  {
    value: 'groups',
    locale: 'contacts.group',
    show: true,
    field: 'groups',
    sort: SortSymbols.NONE,
  },
  {
    value: 'labels',
    locale: ['vocabulary.labels', 1],
    show: true,
    field: 'labels',
  },
  {
    value: 'managers',
    locale: ['contacts.manager', 1],
    show: true,
    field: 'managers',
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
