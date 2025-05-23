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
    value: 'priorities',
    locale: 'vocabulary.priority',
    show: true,
    field: 'priorities',
  },
  {
    value: 'reactionTime',
    locale: 'lookups.slas.reactionTimeTitle',
    show: true,
    field: 'reaction_time',
    sort: SortSymbols.NONE,
  },
  {
    value: 'resolutionTime',
    locale: 'lookups.slas.resolutionTimeTitle',
    show: true,
    field: 'resolution_time',
    sort: SortSymbols.NONE,
  },
];
