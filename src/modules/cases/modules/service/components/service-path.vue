<template>
    <span v-if="servicePath" class="service-path">
      {{ servicePath }}
    </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  service: {
    type: Object,
    default: null,
  },
  catalog: {
    type: Object,
    default: null,
  },
});

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
 * @returns {string} The generated path including catalog name.
 */
function generateServicePathWithCatalog(service, catalog) {
  if (!service || !catalog) return '';

  const path = [];
  let currentService = service;

  // Find the parent service for the given service within a catalog.
  function findParentService(currentService, parentServices) {
    for (const parent of parentServices) {
      if (parent.service?.some((child) => child.id === currentService.id))
        return parent;
      const foundParent =
        parent.service && findParentService(currentService, parent.service);
      if (foundParent) return foundParent;
    }
    return null;
  }

  // Builds the hierarchical path for the service within the catalog.
  while (currentService) {
    path.unshift(currentService.name);
    currentService = findParentService(currentService, catalog.service || []);
  }

  path.unshift(catalog.name);
  return path.join(' / ');
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
