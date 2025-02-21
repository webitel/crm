import {
  CreatedAtFromFilter,
  CreatedAtFromFilterPreview,
  CreatedAtToFilter,
  CreatedAtToFilterPreview,
  StatusCaseFilter,
  StatusCaseFilterPreview,
  SourceCaseFilter,
  SourceCaseFilterPreview,
  AuthorFilter,
  AuthorFilterPreview,
  ReporterFilter,
  ReporterFilterPreview,
  ImpactedFilter,
  ImpactedFilterPreview,
  AssigneeFilter,
  AssigneeFilterPreview,
  PriorityCaseFilter,
  PriorityCaseFilterPreview,
  CloseReasonGroupsCaseFilter,
  CloseReasonGroupsCaseFilterPreview,
  RatingFromToFilter,
  RatingFromToFilterPreview,
  SlaFilter,
  SlaFilterPreview,
  HasAttachmentFilter,
  HasAttachmentFilterPreview,
  ReactionTimeFilter,
  ReactionTimeFilterPreview,
  ResolutionTimeFilter,
  ResolutionTimeFilterPreview,
  ActualReactionTimeFilter,
  ActualReactionTimeFilterPreview,
  ActualResolutionTimeFilterPreview,
  ActualResolutionTimeFilter,
  ContactGroupFilter,
  ContactGroupFilterPreview,
  // ServiceFilter,
  // ServiceFilterPreview,
  SlaConditionFilter,
  SlaConditionFilterPreview
} from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/values/index.js';
import {Component} from "vue";


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
    valueField: StatusCaseFilter,
    previewField: StatusCaseFilterPreview,
  },
  sourceCase: {
    valueField: SourceCaseFilter,
    previewField: SourceCaseFilterPreview,
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
    previewField: ContactGroupFilterPreview
  },
  priorityCase: {
    valueField: PriorityCaseFilter,
    previewField: PriorityCaseFilterPreview,
  },
  closeReasonGroupsCase: {
    valueField: CloseReasonGroupsCaseFilter,
    previewField: CloseReasonGroupsCaseFilterPreview,
  },
  rating: {
    valueField: RatingFromToFilter,
    previewField: RatingFromToFilterPreview
  },
  // service: {
  //   valueField: ServiceFilter,
  //   previewField: ServiceFilterPreview,
  // },
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
    previewField: ReactionTimeFilterPreview
  },
  resolutionTime: {
    valueField: ResolutionTimeFilter,
    previewField: ResolutionTimeFilterPreview,
  },
  actualReactionTime: {
    valueField: ActualReactionTimeFilter,
    previewField: ActualReactionTimeFilterPreview
  },
  actualResolutionTime: {
    valueField: ActualResolutionTimeFilter,
    previewField: ActualResolutionTimeFilterPreview
  },
  hasAttachment: {
    valueField: HasAttachmentFilter,
    previewField: HasAttachmentFilterPreview
  },
}
