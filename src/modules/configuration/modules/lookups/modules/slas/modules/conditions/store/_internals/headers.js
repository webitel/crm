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
    value: 'priorities',
    locale: 'vocabulary.priority',
    show: true,
    field: 'priorities',
    sort: SortSymbols.NONE,
  },
  {
    value: 'reactionTime',
    locale: 'lookups.slas.reactionTime',
    show: true,
    field: 'reaction_time',
    sort: SortSymbols.NONE,
  },
  {
    value: 'resolutionTime',
    locale: 'lookups.slas.resolutionTime',
    show: true,
    field: 'resolution_time',
    sort: SortSymbols.NONE,
  },
];
