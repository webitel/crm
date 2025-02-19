import {
  AuthorFilter,
  AuthorFilterPreview,
  CreatedAtFromFilter,
  CreatedAtFromFilterPreview,
  CreatedAtToFilter,
  CreatedAtToFilterPreview,
  SourceCaseFilter,
  SourceCaseFilterPreview,
  PriorityCaseFilter,
  PriorityCaseFilterPreview,
  ReporterFilter,
  ReporterFilterPreview,
  ImpactedFilter,
  ImpactedFilterPreview,
  SlaFilter,
  SlaFilterPreview,
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
  sourceCase: {
    valueField: SourceCaseFilter,
    previewField: SourceCaseFilterPreview,
  },
  priorityCase: {
    valueField: PriorityCaseFilter,
    previewField: PriorityCaseFilterPreview,
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
  sla: {
    valueField: SlaFilter,
    previewField: SlaFilterPreview,
  }

}

export default FILTER_OPTIONS_COMPONENTS_CONFIG
