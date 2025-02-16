import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';

import MessageHistoryAPI from '../modules/chats/api/MessageHistoryAPI.js';

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
      const parentId = context.rootGetters['cases/card/timeline/PARENT_ID'];
      // const parentId = context.rootGetters['contacts/card/timeline/PARENT_ID'];

      const { items } = await this.apiModule.getList({
        taskId,
        parentId,
      });
      context.commit('SET_TO_HISTORY', { taskId, data: items });
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
