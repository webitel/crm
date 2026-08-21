import { isEmpty } from '@webitel/ui-sdk/scripts';
import get from 'lodash/get';

function findServiceById(services, id) {
	if (!Array.isArray(services)) return null;
	for (const service of services) {
		if (service.id === id) {
			return service;
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

// Resolves the SLA from the service hierarchy: use the current service's SLA
// if set, otherwise climb up parents until one is found, otherwise the catalog's.
export function resolveSla(catalog, currentService) {
	let current = currentService;
	while (current) {
		const slaValue = get(current, 'sla');
		if (!isEmpty(slaValue)) {
			return slaValue;
		}
		current = getParentService(catalog, current);
	}

	const catalogSla = get(catalog, 'sla');
	return isEmpty(catalogSla) ? null : catalogSla;
}

// Resolves group/assignee from the service hierarchy: if the current service
// defines either, both are locked as-is (even if empty); otherwise climb up
// parents until one has a non-empty value.
export function resolveGroupOrAssignee(catalog, currentService, propertyPath) {
	const currentGroup = get(currentService, 'group');
	const currentAssignee = get(currentService, 'assignee');

	if (!isEmpty(currentGroup) || !isEmpty(currentAssignee)) {
		return get(currentService, propertyPath) || null;
	}

	let current = currentService;
	while (current) {
		const parentValue = get(current, propertyPath);
		if (!isEmpty(parentValue)) {
			return parentValue;
		}
		current = getParentService(catalog, current);
	}
	return null;
}
