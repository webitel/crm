import { createBaseStoreModule } from '@webitel/ui-sdk/store';
import get from 'lodash/get';

const state = {
  catalog: null,
  service: null,
};

const getters = {
  SERVICE_ID: (state) => state.service?.id,
  CLOSE_REASON_ID: (state) => state.catalog?.closeReasonGroup?.id,
  STATUS: (state) => state.catalog?.status,
  SLA: (state) => resolvePropertyFromHierarchy(state, 'sla'),
  GROUP: (state) => resolvePropertyFromHierarchy(state, 'group'),
  ASSIGNEE: (state) => resolvePropertyFromHierarchy(state, 'assignee'),
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

// Checks if a value is non-empty (exists and has at least one key).
function hasValidValue(value) {
  return value && Object.keys(value).length > 0;
}

 // Walks up the service hierarchy to find the first non-empty property
 // For SLA: if no service in the hierarchy defines it, fall back to the catalog SLA
 // For Group/Assignee: if either is set on the current service, do not override

function resolvePropertyFromHierarchy(state, propertyPath) {
  let current = state.service;
  if (!current) return null;

  // For group and assignee, if either is already defined on the subservice, do not inherit.
  if (propertyPath === 'group' || propertyPath === 'assignee') {
    if (hasValidValue(get(current, 'group')) || hasValidValue(get(current, 'assignee'))) {
      return get(current, propertyPath) || null;
    }
  }

  // Traverse up the hierarchy using the service's rootId to locate the parent
  while (current) {
    const value = get(current, propertyPath, {});
    if (hasValidValue(value)) {
      return value;
    }
    current = state.catalog?.service?.find(item => item.id === current.rootId);
  }

  // For SLA, if no valid service value is found, fall back to the catalog SLA
  if (propertyPath === 'sla') {
    const catalogSla = get(state, 'catalog.sla', {});
    if (hasValidValue(catalogSla)) {
      return catalogSla;
    }
  }

  return null;
}
