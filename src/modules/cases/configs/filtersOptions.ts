import {
	type FilterConfigDefinition,
	FilterOption,
} from '@webitel/ui-datalist/filters';

export const filterConfigs = {
	[FilterOption.CreatedAt]: FilterOption.CreatedAt,
	[FilterOption.CaseStatus]: FilterOption.CaseStatus,
	[FilterOption.CaseSource]: FilterOption.CaseSource,
	[FilterOption.CaseService]: FilterOption.CaseService,
	[FilterOption.CaseAuthor]: FilterOption.CaseAuthor,
	[FilterOption.CaseReporter]: FilterOption.CaseReporter,
	[FilterOption.CaseImpacted]: FilterOption.CaseImpacted,
	[FilterOption.CaseAssignee]: FilterOption.CaseAssignee,
	[FilterOption.ContactGroup]: FilterOption.ContactGroup,
	[FilterOption.CasePriority]: FilterOption.CasePriority,
	[FilterOption.CaseCloseReasonGroups]: FilterOption.CaseCloseReasonGroups,
	[FilterOption.Rating]: FilterOption.Rating,
	[FilterOption.CaseSla]: FilterOption.CaseSla,
	[FilterOption.CaseSlaCondition]: FilterOption.CaseSlaCondition,
	[FilterOption.CaseReactionTime]: FilterOption.CaseReactionTime,
	[FilterOption.CaseResolutionTime]: FilterOption.CaseResolutionTime,
	[FilterOption.CaseActualReactionTime]: FilterOption.CaseActualReactionTime,
	[FilterOption.CaseActualResolutionTime]:
		FilterOption.CaseActualResolutionTime,
	[FilterOption.HasAttachment]: FilterOption.HasAttachment,
} satisfies Record<string, FilterConfigDefinition>;

export const filtersOptions: FilterConfigDefinition[] =
	Object.values(filterConfigs);
