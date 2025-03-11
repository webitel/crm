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
  return value && typeof value === 'object' && Object.keys(value).length > 0;
}

function findServiceById(services, id) {
  if (!Array.isArray(services)) {
    return null;
  }
  for (const svc of services) {
    if (svc.id === id) {
      return svc;
    }
    // If there's a nested 'service' array, recurse into it
    if (Array.isArray(svc.service) && svc.service.length) {
      const found = findServiceById(svc.service, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function getParentService(catalog, currentService) {
  const parentId = currentService.rootId;
  if (!parentId) {
    return null;
  }
  return findServiceById(get(catalog, 'service', []), parentId);
}


// Walks up the service hierarchy to find the first non-empty property
// For SLA: if no service in the hierarchy defines it, fall back to the catalog SLA
// For Group/Assignee: if either is set on the current service, do not override
function resolvePropertyFromHierarchy(state, propertyPath) {
  let current = state.service;
  if (!current) return null;

  //Handle SLA specifically
  if (propertyPath === 'sla') {
    while (current) {
      const currentSla = get(current, 'sla');
      if (hasValidValue(currentSla)) {
        return currentSla;
      }
      // Move to the parent service
      current = getParentService(state.catalog, current);
    }
    // If no service has SLA, fall back to catalog's SLA
    const catalogSla = get(state.catalog, 'sla');
    return hasValidValue(catalogSla) ? catalogSla : null;
  }

  // Handle group or assignee
  if (propertyPath === 'group' || propertyPath === 'assignee') {
    // If the current service defines either group or assignee, we "lock" them in
    const currentGroup = get(state.service, 'group');
    const currentAssignee = get(state.service, 'assignee');
    // If EITHER is non-empty, do not override from parent
    if (hasValidValue(currentGroup) || hasValidValue(currentAssignee)) {
      // Return whichever property we were asked for, even if it’s empty
      return get(state.service, propertyPath) || null;
    }

    // If BOTH are empty, we can try to inherit from the parent
    while (current) {
      const val = get(current, propertyPath);
      if (hasValidValue(val)) {
        return val;
      }
      // Move up
      current = getParentService(state.catalog, current);
    }
    // If no valid group/assignee found, return null
    return null;
  }

  // For safety, in case there's a new field we haven't handled
  return null;
}
