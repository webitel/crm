import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { CaseServiceNamespace } from '../namespace';
import {
	resolveGroupOrAssignee,
	resolveSla,
} from './_internals/resolveServiceHierarchy';

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
