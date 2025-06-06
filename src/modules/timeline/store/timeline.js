import ApiStoreModule from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import BaseStoreModule from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import set from 'lodash/set.js';

import TimelineAPI from '../api/TimelineAPI';
import calls from '../modules/calls/store/calls.js';
import chats from '../modules/chats/store/chats.js';
import filters from '../modules/filters/store/filters';

const state = {
  parentId: null,
  mode: null,

  dataList: [],
  page: 1,
  size: 15,
  next: false,
  isLoading: false,
};

const getters = {
  PARENT_ID: (state) => state.parentId,
  MODE: (state) => state.mode,
  FILTERS: (state, getters) => getters['filters/GET_FILTERS'],
};

const actions = {
  INITIALIZE_LIST: async (context) => {
    const mode = context.getters.MODE;

    try {
      context.commit('SET', { path: 'isLoading', value: true });
      context.commit('SET', { path: 'page', value: 1 });
      context.commit('SET', { path: 'size', value: 15 });
      const { items, next } = await context.dispatch('api/GET_LIST', {
        mode,
        context,
        params: context.getters.FILTERS(),
      });
      context.commit('SET', { path: 'dataList', value: items });
      context.commit('SET', { path: 'next', value: next });
    } finally {
      context.commit('SET', { path: 'isLoading', value: false });
    }
  },
  LOAD_NEXT: async (context) => {
    if (!context.state.next) return;

    const mode = context.getters.MODE;

    context.commit('SET', { path: 'page', value: context.state.page + 1 });
    context.commit('SET', { path: 'size', value: 10 });
    const { items, next } = await context.dispatch('api/GET_LIST', {
      mode,
      context,
      params: {
        ...context.getters.FILTERS(),
        page: context.state.page,
      },
    });
    context.commit('SET', {
      path: 'dataList',
      value: [...context.state.dataList, ...items],
    });
    context.commit('SET', { path: 'next', value: next });
  },
  RESET_STATE: (context) => {
    context.commit('SET', { path: 'dataList', value: [] });
    context.commit('SET', { path: 'page', value: 1 });
    context.commit('SET', { path: 'size', value: 15 });
    context.commit('SET', { path: 'next', value: false });
  },
};

const mutations = {
  SET: (state, { path, value }) => {
    set(state, path, value);
  },
};

const api = new ApiStoreModule().generateAPIActions(TimelineAPI).getModule();

const timeline = new BaseStoreModule().getModule({
  state,
  getters,
  actions,
  mutations,
  modules: {
    chats,
    calls,
    api,
    filters,
  },
});

export default timeline;
