import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import MessageHistoryAPI from '../api/MessageHistoryAPI.js';

const state = {
  historyById: {}, // by chatId
};

const getters = {
  CONTACT_ID: (s, g, rS, rootGetters) => rootGetters['contacts/card/timeline/PARENT_ID'],
  HISTORY_BY_CHAT_ID: (state) => (chatId) => state.historyById[chatId],
};

const actions = {
  LOAD_HISTORY: async (context, { chatId }) => {
    const { items } = await MessageHistoryAPI.getList({
      contactId: context.getters.CONTACT_ID,
      chatId,
    });
    context.commit('SET_TO_HISTORY', { chatId, data: items });
  },
  GET_HISTORY_BY_CHAT_ID: async (context, { chatId }) => {
    const history = context.getters.HISTORY_BY_CHAT_ID(chatId);
    if (history) return history;
    await context.dispatch('LOAD_HISTORY', { chatId });
    return context.getters.HISTORY_BY_CHAT_ID(chatId);
  },
};

const mutations = {
  SET_TO_HISTORY: (state, { chatId, data }) => {
    state.historyById[chatId] = data;
  },
};

const chats = new BaseStoreModule().getModule({
  state,
  getters,
  actions,
  mutations,
});

export default chats;
