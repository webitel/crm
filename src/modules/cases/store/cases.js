import { CasesAPI } from '@webitel/api-services/api';
import {
	createApiStoreModule,
	createBaseStoreModule,
	createCardStoreModule,
} from '@webitel/ui-sdk/store';

const resetCardState = {
	itemId: 0,
	itemInstance: {
		id: '',
		name: '',
		assignee: {},
		author: {},
		closeReason: {},
		closeResult: '',
		closeReasonGroup: {},
		comments: {},
		contactInfo: '',
		createdAt: '',
		createdBy: '',
		description: '',
		group: {},
		impacted: {},
		links: [],
		files: [],
		plannedReactionAt: '',
		plannedResolutionAt: '',
		priority: {},
		rating: '',
		ratingComment: '',
		reporter: {},
		service: {},
		sla: {},
		slaCondition: {},
		source: {},
		status: {},
		statusCondition: {},
		subject: '',
		reactedAt: '',
		resolvedAt: '',
	},
};

const api = createApiStoreModule({
	state: {
		api: CasesAPI,
	},
});

const card = createCardStoreModule({
	state: {
		_resettable: resetCardState,
		itemInstance: resetCardState.itemInstance,
	},
	modules: {
		api,
	},
});

const cases = createBaseStoreModule({
	modules: {
		card,
	},
});

export default cases;
