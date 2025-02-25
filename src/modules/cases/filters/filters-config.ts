import {
  ActualReactionTimeFilter,
  ActualReactionTimeFilterPreview,
  ActualResolutionTimeFilter,
  ActualResolutionTimeFilterPreview,
  AssigneeFilter,
  AssigneeFilterPreview,
  AuthorFilter,
  AuthorFilterPreview,
  CasePriorityFilter,
  CasePriorityFilterPreview,
  CaseServiceFilter,
  CaseServiceFilterPreview,
  CaseSourceFilter,
  CaseSourceFilterPreview,
  CaseStatusFilter,
  CaseStatusFilterPreview,
  CloseReasonGroupsCaseFilter,
  CloseReasonGroupsCaseFilterPreview,
  ContactGroupFilter,
  ContactGroupFilterPreview,
  CreatedAtFromFilter,
  CreatedAtFromFilterPreview,
  CreatedAtToFilter,
  CreatedAtToFilterPreview,
  HasAttachmentFilter,
  HasAttachmentFilterPreview,
  ImpactedFilter,
  ImpactedFilterPreview,
  RatingFromToFilter,
  RatingFromToFilterPreview,
  ReactionTimeFilter,
  ReactionTimeFilterPreview,
  ReporterFilter,
  ReporterFilterPreview,
  ResolutionTimeFilter,
  ResolutionTimeFilterPreview,
  SlaConditionFilter,
  SlaConditionFilterPreview,
  SlaFilter,
  SlaFilterPreview,
} from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/values/index.js';
import { Component } from 'vue';

interface FiltersConfig {
  [key: string]: {
    valueField: Component
    previewField: Component
  }
}

export const filtersConfig: FiltersConfig = {
  createdAtFrom: {
    valueField: CreatedAtFromFilter,
    previewField: CreatedAtFromFilterPreview,
  },
  createdAtTo: {
    valueField: CreatedAtToFilter,
    previewField: CreatedAtToFilterPreview,
  },
  statusCase: {
    valueField: CaseStatusFilter,
    previewField: CaseStatusFilterPreview,
  },
  sourceCase: {
    valueField: CaseSourceFilter,
    previewField: CaseSourceFilterPreview,
  },
  serviceCase: {
    valueField: CaseServiceFilter,
    previewField: CaseServiceFilterPreview,
  },
  author: {
    valueField: AuthorFilter,
    previewField: AuthorFilterPreview,
  },
  reporter: {
    valueField: ReporterFilter,
    previewField: ReporterFilterPreview,
  },
  impacted: {
    valueField: ImpactedFilter,
    previewField: ImpactedFilterPreview,
  },
  assignee: {
    valueField: AssigneeFilter,
    previewField: AssigneeFilterPreview,
  },
  contactGroup: {
    valueField: ContactGroupFilter,
    previewField: ContactGroupFilterPreview,
  },
  priorityCase: {
    valueField: CasePriorityFilter,
    previewField: CasePriorityFilterPreview,
  },
  closeReasonGroupsCase: {
    valueField: CloseReasonGroupsCaseFilter,
    previewField: CloseReasonGroupsCaseFilterPreview,
  },
  rating: {
    valueField: RatingFromToFilter,
    previewField: RatingFromToFilterPreview,
  },
  sla: {
    valueField: SlaFilter,
    previewField: SlaFilterPreview,
  },
  slaCondition: {
    valueField: SlaConditionFilter,
    previewField: SlaConditionFilterPreview,
  },
  reactionTime: {
    valueField: ReactionTimeFilter,
    previewField: ReactionTimeFilterPreview,
  },
  resolutionTime: {
    valueField: ResolutionTimeFilter,
    previewField: ResolutionTimeFilterPreview,
  },
  actualReactionTime: {
    valueField: ActualReactionTimeFilter,
    previewField: ActualReactionTimeFilterPreview,
  },
  actualResolutionTime: {
    valueField: ActualResolutionTimeFilter,
    previewField: ActualResolutionTimeFilterPreview,
  },
  hasAttachment: {
    valueField: HasAttachmentFilter,
    previewField: HasAttachmentFilterPreview,
  },
};
