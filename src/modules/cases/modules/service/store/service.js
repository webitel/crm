import { createBaseStoreModule } from '@webitel/ui-sdk/store';

const state = {
  catalog: null,
  service: null,
};

const getters = {
  CATALOG: (state) => state.catalog,
  SERVICE: (state) => state.service,
  CLOSE_REASON_ID: (state) => state.catalog?.closeReason.id,
  STATUS_ID: (state) => state.catalog?.status.id,
  SLA_ID: (state) => resolvePropertyFromHierarchy(state, ['sla', 'id']),
  GROUP_ID: (state) => resolvePropertyFromHierarchy(state, ['group', 'id']),
  ASSIGNEE_ID: (state) => resolvePropertyFromHierarchy(state, ['assignee', 'id']),
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


// Helper function to resolve a nested property from the service hierarchy.
function resolvePropertyFromHierarchy(state, propertyPath) {
  const findProperty = (service) => {
    if (!service) return null;

    const propertyValue = getNestedProperty(service, propertyPath);
    if (propertyValue) return propertyValue;

    const parentService = state.catalog?.service?.find(
      (item) => item.id === service.rootId
    );

    return findProperty(parentService);
  };

  return findProperty(state.service);
}


// Helper function to safely access nested properties.
function getNestedProperty(obj, path) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
}
