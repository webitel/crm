import {
  CreatedAtFromFilter,
  CreatedAtFromFilterPreview,
  CreatedAtToFilter,
  CreatedAtToFilterPreview,
  StatusCaseFilter,
  StatusCasePreview,
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
  CloseReasonGroupsCasePreview,
  RatingFromToFilter,
  RatingFromToFilterPreview,
  SlaFilter,
  SlaFilterPreview,
  HasAttachmentFilter,
  HasAttachmentFilterPreview,
} from '@webitel/ui-sdk/src/modules/Filters/v2/filters/components/values/index.js';
import {Component} from "vue";


interface FilterOptionsComponentsConfig {
  [key: string]: {
    valueField: Component
    previewField: Component
  }
}

const FILTER_OPTIONS_COMPONENTS_CONFIG: FilterOptionsComponentsConfig = {
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
    previewField: StatusCasePreview,
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
  priorityCase: {
    valueField: PriorityCaseFilter,
    previewField: PriorityCaseFilterPreview,
  },
  closeReasonGroupsCase: {
    valueField: CloseReasonGroupsCaseFilter,
    previewField: CloseReasonGroupsCasePreview,
  },
  rating: {
    valueField: RatingFromToFilter,
    previewField: RatingFromToFilterPreview
  },
  sla: {
    valueField: SlaFilter,
    previewField: SlaFilterPreview,
  },
  hasAttachment: {
    valueField: HasAttachmentFilter,
    previewField: HasAttachmentFilterPreview
  },
}

export default FILTER_OPTIONS_COMPONENTS_CONFIG
