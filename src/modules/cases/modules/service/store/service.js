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
// 1. SLA:
//    - Climb up the chain until we find a non-empty SLA.
//    - If none found, use catalog’s SLA if present.
//
// 2. Group & Assignee (Single-level inheritance):
//   - If current (lowest) service has a non-empty group or assignee,
//      we return exactly the current service’s property (locking both in place).
//    - If both are empty, we look ONLY at the immediate parent’s property:
//      - If the parent has a non-empty property, return it;
//      - Otherwise, return null (we do not keep climbing).
function resolvePropertyFromHierarchy(state, propertyPath) {
  const currentService = state.service;
  if (!currentService) return null;

  if (propertyPath === 'sla') {
    let svc = currentService;
    while (svc) {
      const slaValue = get(svc, 'sla');
      if (hasValidValue(slaValue)) {
        return slaValue;
      }
      svc = getParentService(state.catalog, svc);
    }

    const catalogSla = get(state.catalog, 'sla');
    return hasValidValue(catalogSla) ? catalogSla : null;
  }

  if (propertyPath === 'group' || propertyPath === 'assignee') {
    const currentGroup = get(currentService, 'group');
    const currentAssignee = get(currentService, 'assignee');

    // If either is non-empty on the current service, lock them both in place
    if (hasValidValue(currentGroup) || hasValidValue(currentAssignee)) {
      // Return whichever property is asked for (could be empty)
      return get(currentService, propertyPath) || null;
    }

    // Both group & assignee are empty => check only the immediate parent
    const parent = getParentService(state.catalog, currentService);
    if (!parent) return null; // No parent => can't inherit

    // Check the parent's property
    const parentValue = get(parent, propertyPath);
    return hasValidValue(parentValue) ? parentValue : null;
  }

  // If some other property is requested, default to null
  return null;
}
