import type { WtTableHeader } from '@webitel/ui-sdk/src/components/wt-table/types/WtTable';
import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

export const headers: WtTableHeader[] = [
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
    // width: '100px',
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
    value: 'groups',
    locale: 'reusable.group',
    show: true,
    field: 'groups',
    sort: SortSymbols.NONE,
  },
];
