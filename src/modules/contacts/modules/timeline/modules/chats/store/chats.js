import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import MessageHistoryAPI from '../api/MessageHistoryAPI.js';

const state = {
  historyById: {}, // by chatId
};

const getters = {
  HISTORY_BY_CHAT_ID: (state) => (taskId) => state.historyById[taskId],
};

const actions = {
  LOAD_HISTORY: async (context, { taskId }) => {
    const { items } = await MessageHistoryAPI.getList({
      taskId,
    });
    context.commit('SET_TO_HISTORY', { taskId, data: items });
  },
};

const mutations = {
  SET_TO_HISTORY: (state, { taskId, data }) => {
    state.historyById[taskId] = data;
  },
};

const chats = new BaseStoreModule().getModule({
  state,
  getters,
  actions,
  mutations,
});

export default chats;
