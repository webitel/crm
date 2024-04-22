import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import set from 'lodash/set.js';
import TimelineAPI from '../api/TimelineAPI';
import filters from '../modules/filters/store/filters';

const state = {
  dataList: [],
  page: 1,
  next: false,
  isLoading: false,
};

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.contacts.card.itemId,
  FILTERS: (s, getters) => getters['filters/GET_FILTERS'],
};

const actions = {
  INITIALIZE_LIST: async (context) => {
    try {
      context.commit('SET', { path: 'isLoading', value: true });
      const { items, next } = await context.dispatch('api/GET_LIST', {
        context,
        params: context.getters.FILTERS,
      });
      context.commit('SET', { path: 'dataList', value: items });
      context.commit('SET', { path: 'next', value: next });
    } finally {
      context.commit('SET', { path: 'isLoading', value: false });
    }
  },
  LOAD_NEXT: async (context) => {
    if (!context.next) return;
    context.commit('SET', { path: 'page', value: context.state.page + 1 });
    const { items, next } = await context.dispatch('api/GET_LIST', {
      context,
      params: context.getters.FILTERS,
    });
    context.commit('SET', { path: 'dataList', value: [...context.state.dataList, ...items] });
    context.commit('SET', { path: 'next', value: next });
  },
};

const mutations = {
  SET: (state, { path, value }) => {
    set(state, path, value);
  },
};

const api = new ApiStoreModule()
.generateAPIActions(TimelineAPI)
.getModule();

const timeline = new BaseStoreModule()
.getModule(  {
  state,
  getters,
  actions,
  mutations,
  modules: {
    api,
    filters,
  },
});

export default timeline;
