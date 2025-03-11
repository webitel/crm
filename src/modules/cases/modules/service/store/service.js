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

function hasValidValue(value) {
  return value && typeof value === 'object' && Object.keys(value).length > 0;
}

function findServiceById(services, id) {
  if (!Array.isArray(services)) return null;
  for (const service of services) {
    if (service.id === id) {
      return svc;
    }
    if (service.service && Array.isArray(service.service)) {
      const found = findServiceById(service.service, id);
      if (found) return found;
    }
  }
  return null;
}

function getParentService(catalog, currentService) {
  const parentId = currentService?.rootId;
  if (!parentId) return null;
  return findServiceById(get(catalog, 'service', []), parentId);
}

// Resolves a property from the service hierarchy.
//
//   SLA:
// - If current service has non-empty SLA => return it.
//   - Otherwise climb up until we find a non-empty SLA or run out of parents.
// - If no SLA found, fallback to catalog.sla if present.
//
//   Group & Assignee:
// - If current service has either group or assignee => lock those in place
// (i.e., return exactly currentService[propertyPath], even if empty).
// - Otherwise climb up the chain until we find a non-empty property or run out of parents.
// - If no parent has it, return null.
//
function resolvePropertyFromHierarchy(state, propertyPath) {
  let current = state.service;
  if (!current) return null;

  if (propertyPath === 'sla') {
    while (current) {
      const slaValue = get(current, 'sla');
      if (hasValidValue(slaValue)) {
        return slaValue;
      }
      current = getParentService(state.catalog, current);
    }
    // No SLA found in the chain => fallback to catalog.sla
    const catalogSla = get(state.catalog, 'sla');
    return hasValidValue(catalogSla) ? catalogSla : null;
  }

  if (propertyPath === 'group' || propertyPath === 'assignee') {
    const currentGroup = get(state.service, 'group');
    const currentAssignee = get(state.service, 'assignee');

    // If the subservice defines either group or assignee, lock them both as-is
    if (hasValidValue(currentGroup) || hasValidValue(currentAssignee)) {
      return get(state.service, propertyPath) || null;
    }

    // Both group & assignee are empty => search up the entire chain
    while (current) {
      const parentValue = get(current, propertyPath);
      if (hasValidValue(parentValue)) {
        return parentValue;
      }
      current = getParentService(state.catalog, current);
    }
    return null;
  }

  // If some unexpected property is requested, return null
  return null;
}
