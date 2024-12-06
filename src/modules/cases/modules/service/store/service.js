import { createBaseStoreModule } from '@webitel/ui-sdk/store';

const state = {
  catalog: null,
  service: null,
};

const getters = {
  CLOSE_REASON_ID: (state) => state.catalog?.closeReason.id,
  STATUS_ID: (state) => state.catalog?.status.id,
  SLA_ID: (state) => resolvePropertyFromHierarchy(state, 'sla.id'),
  GROUP_ID: (state) => resolvePropertyFromHierarchy(state, 'group.id'),
  ASSIGNEE_ID: (state) => resolvePropertyFromHierarchy(state, 'assignee.id'),
};

const actions = {
  SET_SERVICE(context, service) {
    context.commit('SET', {
      path: 'service',
      value: service,
    });
  },
  SET_CATALOG(context, catalog) {
    context.commit('SET', {
      path: 'catalog',
      value: catalog,
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

    const propertyValue = get(service, propertyPath);

    if (propertyValue) return propertyValue;

    // Find parent service in the catalog using rootId
    const parentService = state.catalog?.service?.find(
      (item) => item.id === service.rootId
    );

    return findProperty(parentService); // Recursive call to parent
  };

  return findProperty(state.service);
}
