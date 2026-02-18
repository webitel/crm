import BaseStoreModule from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';

export default class TimelineTaskPointsModule extends BaseStoreModule {
	apiModule = null;

	state = {
		historyById: {}, // by chatId
	};

	getters = {
		GET_HISTORY_BY_ID: (state) => (taskId) => state.historyById[taskId],
	};

	actions = {
		LOAD_HISTORY: async (context, { taskId }) => {
			const mode = context.rootGetters['timeline/MODE'];
			const parentId = context.rootGetters['timeline/PARENT_ID'];

			const { items } = await this.apiModule.getList({
				mode,
				taskId,
				parentId,
			});
			context.commit('SET_TO_HISTORY', {
				taskId,
				data: items,
			});
		},
	};

	mutations = {
		SET_TO_HISTORY: (state, { taskId, data }) => {
			state.historyById[taskId] = data;
		},
	};

	constructor({ apiModule }) {
		super();

		if (!apiModule) {
			throw new Error('TimelineTaskPointsModule: apiModule is required');
		}

		this.apiModule = apiModule;
	}
}
