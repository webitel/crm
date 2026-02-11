import { createObjectPermissionsStoreModule } from '@webitel/ui-sdk/src/modules/ObjectPermissions/store/index';
import {
	createApiStoreModule,
	createBaseStoreModule,
	createCardStoreModule,
	createTableStoreModule,
} from '@webitel/ui-sdk/store';

import CasesAPI from '../api/CasesAPI.js';
import files from '../modules/attachments/modules/files/store/files.js';
import links from '../modules/attachments/modules/links/store/links.js';
import filters from '../modules/filters/store/filters.js';
import service from '../modules/service/store/service.js';
import { headers } from './_internals/headers';

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

const state = {
	editMode: false,
};

const getters = {
	EDIT_MODE: (state) => state.editMode,
};

const actions = {
	TOGGLE_EDIT_MODE: (context, payload) => {
		context.commit('SET', {
			path: 'editMode',
			value: payload,
		});
	},
};

const api = createApiStoreModule({
	state: {
		api: CasesAPI,
	},
});

const permissions = createObjectPermissionsStoreModule({
	modules: {
		table: {
			getters: {
				PARENT_ID: (s, g, rootState) => rootState.cases.card.itemId,
			},
			modules: {
				api,
			},
		},
	},
});

const table = createTableStoreModule({
	state: {
		headers,
	},
	modules: {
		api,
		filters,
	},
});
const card = createCardStoreModule({
	state: {
		_resettable: resetCardState,
		itemInstance: resetCardState.itemInstance,
		...state,
	},
	modules: {
		api,
		service,
		links,
		files,
		permissions,
	},
	actions,
	getters,
});

const cases = createBaseStoreModule({
	modules: {
		table,
		card,
	},
});

export default cases;
