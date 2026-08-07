import get from 'lodash/get';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { CaseServiceNamespace } from '../namespace';

function hasValidValue(value) {
	return value && typeof value === 'object' && Object.keys(value).length > 0;
}

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
function resolveSla(catalog, currentService) {
	let current = currentService;
	while (current) {
		const slaValue = get(current, 'sla');
		if (hasValidValue(slaValue)) {
			return slaValue;
		}
		current = getParentService(catalog, current);
	}

	const catalogSla = get(catalog, 'sla');
	return hasValidValue(catalogSla) ? catalogSla : null;
}

// Resolves group/assignee from the service hierarchy: if the current service
// defines either, both are locked as-is (even if empty); otherwise climb up
// parents until one has a non-empty value.
function resolveGroupOrAssignee(catalog, currentService, propertyPath) {
	const currentGroup = get(currentService, 'group');
	const currentAssignee = get(currentService, 'assignee');

	if (hasValidValue(currentGroup) || hasValidValue(currentAssignee)) {
		return get(currentService, propertyPath) || null;
	}

	let current = currentService;
	while (current) {
		const parentValue = get(current, propertyPath);
		if (hasValidValue(parentValue)) {
			return parentValue;
		}
		current = getParentService(catalog, current);
	}
	return null;
}

export const useCaseServiceStore = defineStore(CaseServiceNamespace, () => {
	const service = ref(null);
	const catalog = ref(null);

	const serviceId = computed(() => service.value?.id);
	const closeReasonId = computed(() => catalog.value?.closeReasonGroup?.id);
	const status = computed(() => catalog.value?.status);
	const sla = computed(() => {
		if (!service.value) return null;
		return resolveSla(catalog.value, service.value);
	});
	const group = computed(() => {
		if (!service.value) return null;
		return resolveGroupOrAssignee(catalog.value, service.value, 'group');
	});
	const assignee = computed(() => {
		if (!service.value) return null;
		return resolveGroupOrAssignee(catalog.value, service.value, 'assignee');
	});

	function setService(value) {
		service.value = value;
	}

	function setCatalog(value) {
		catalog.value = value;
	}

	function $reset() {
		service.value = null;
		catalog.value = null;
	}

	return {
		service,
		catalog,

		serviceId,
		closeReasonId,
		status,
		sla,
		group,
		assignee,

		setService,
		setCatalog,
		$reset,
	};
});
