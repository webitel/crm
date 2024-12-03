import { createBaseStoreModule } from '@webitel/ui-sdk/store';

const state = {
  catalog: null,
  service: null,
};

const getters = {
  CATALOG: (state) => state.catalog,
  SERVICE: (state) => state.service,
};

const actions = {
  SET_SERVICE(context, service) {
    context.commit('SET', {
      path: 'service',
      value: service,
    });
  },
  SET_CATALOG(context, service) {
    context.commit('SET', {
      path: 'catalog',
      value: service,
    });
  },
};

const mutations = {};

const service = createBaseStoreModule({
  state,
  actions,
  getters,
  mutations,
});

export default service;
