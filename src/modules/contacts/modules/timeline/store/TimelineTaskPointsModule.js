import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import MessageHistoryAPI from '../modules/chats/api/MessageHistoryAPI.js';

export default class TimelineTaskPointsModule extends BaseStoreModule {
  apiModule = null;

  state = {
    historyById: {}, // by chatId
  };

  getters = {
    HISTORY_BY_CHAT_ID: (state) => (taskId) => state.historyById[taskId],
  };

  actions = {
    LOAD_HISTORY: async (context, { taskId }) => {
      const { items } = await this.apiModule.getList({
        taskId,
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
