<template>
    <span v-if="servicePath" class="service-path">
      {{ servicePath }}
    </span>
</template>

<script setup lang="ts">
import type { WebitelCasesService } from '@webitel/api-services/gen/models';
import { findTreePath } from '@webitel/ui-sdk/utils';
import { computed } from 'vue';

const props = withDefaults(
	defineProps<{
		service?: Record<string, any> | null;
		catalog?: Record<string, any> | null;
	}>(),
	{
		service: null,
		catalog: null,
	},
);

/**
 * @description Traverses a nested service object to build a breadcrumb-style path string.
 * @param {object} service - The service object with a potential nested `service` array.
 * @returns {string} The generated path, e.g., "Root / Parent / Child".
 */
function generateServicePath(service) {
	if (!service) return '';

	const pathParts = [];
	let currentService = service;

	// Traverse up the service hierarchy
	while (currentService) {
		if (currentService.name) {
			pathParts.push(currentService.name);
		}
		// The parent is expected to be the first element in the 'service' array
		currentService = currentService.service?.[0];
	}

	// Reverse to get the correct order (root -> child) and join
	return pathParts.reverse().join(' / ');
}

/**
 * @description Builds service path using catalog and service data.
 * @param {object} service - The service object.
 * @param {object} catalog - The catalog object containing service hierarchy.
 * @returns {string} The generated path including catalog name, e.g.
 * "Catalog / Parent / Child"; a service the catalog does not contain is
 * still named after the catalog.
 */
function generateServicePathWithCatalog(service, catalog) {
	if (!service || !catalog) return '';

	const servicePath = findTreePath(
		catalog.service as WebitelCasesService[],
		(candidate) => candidate.id === service.id,
		'service',
	) ?? [
		service,
	];

	return [
		catalog.name,
		...servicePath.map(({ name }) => name),
	].join(' / ');
}

// Computed path to show in template
const servicePath = computed(() => {
	// If we have both service and catalog, use the catalog-based path generation
	if (props.service && props.catalog) {
		return generateServicePathWithCatalog(props.service, props.catalog);
	}

	// Otherwise, use the original hierarchical service path generation
	return generateServicePath(props.service);
});
</script>
<style scoped>
.service-path {
  word-break: keep-all;
}
</style>
