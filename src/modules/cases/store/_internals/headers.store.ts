import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';
import { WtTableHeader } from '@webitel/ui-sdk/src/components/wt-table/types/WtTable.type.js';

export const headersStore: WtTableHeader[] = [
  {
    value: 'id',
    locale: 'cases.id',
    show: true,
    field: 'id',
    sort: SortSymbols.NONE,
  },
  {
    value: 'subject',
    locale: 'cases.subject',
    show: true,
    field: 'subject',
    sort: SortSymbols.NONE,
  },
  {
    value: 'priority',
    locale: 'vocabulary.priority',
    show: true,
    field: 'priority',
    sort: SortSymbols.NONE,
  },
  {
    value: 'statusCondition',
    locale: 'cases.status',
    show: true,
    field: 'status_condition',
    sort: SortSymbols.NONE,
  },
  {
    value: 'source',
    locale: 'cases.source',
    show: true,
    field: 'source',
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
    value: 'service',
    locale: 'cases.service',
    show: true,
    field: 'service',
    sort: SortSymbols.NONE,
  },
  {
    value: 'createdBy',
    locale: 'cases.author',
    show: true,
    field: 'created_by',
    sort: SortSymbols.NONE,
  },
  {
    value: 'group',
    locale: 'cases.group',
    show: true,
    field: 'group',
    sort: SortSymbols.NONE,
  },
  {
    value: 'assignee',
    locale: 'cases.assignee',
    show: true,
    field: 'assignee',
    sort: SortSymbols.NONE,
  },
  {
    value: 'reporter',
    locale: 'cases.reporter',
    show: true,
    field: 'reporter',
    sort: SortSymbols.NONE,
  },
  {
    value: 'impacted',
    locale: 'cases.impacted',
    show: true,
    field: 'impacted',
    sort: SortSymbols.NONE,
  },
  {
    value: 'appliedSLA',
    locale: 'cases.appliedSLA',
    show: true,
    field: 'sla',
    sort: SortSymbols.NONE,
  },
  {
    value: 'slaCondition',
    locale: 'cases.appliedCondition',
    show: true,
    field: 'sla_condition',
    sort: SortSymbols.NONE,
  },
  {
    value: 'plannedReactionAt',
    locale: 'cases.reactionTime',
    show: true,
    field: 'planned_reaction_at',
    sort: SortSymbols.NONE,
  },
  {
    value: 'plannedResolveAt',
    locale: 'cases.resolutionTime',
    show: true,
    field: 'planned_resolve_at',
    sort: SortSymbols.NONE,
  },
  {
    value: 'actualReactionTime',
    locale: 'cases.actualReactionTime',
    show: true,
    field: 'timing',
    sort: SortSymbols.NONE,
  },
  {
    value: 'actualResolutionTime',
    locale: 'cases.actualResolutionTime',
    show: true,
    field: 'timing',
    sort: SortSymbols.NONE,
  },
  {
    value: 'closeReason',
    locale: 'cases.reason',
    show: true,
    field: 'close',
    sort: SortSymbols.NONE,
  },
  {
    value: 'closeResult',
    locale: 'cases.result',
    show: true,
    field: 'close',
    sort: SortSymbols.NONE,
  },
  {
    value: 'rate',
    locale: 'cases.rating',
    show: true,
    field: 'rate',
    sort: SortSymbols.NONE,
  },
];

