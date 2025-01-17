<template>
  <wt-popup
    :shown="shown"
  >
    <template #actions>
      <wt-button
        @click="save"
      >
        {{ $t('reusable.add') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ $t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import CatalogAPI from '../api/CatalogAPI.js';
import { serviceCatalogData } from '../api/example.js';
import ServiceAPI from '../api/ServiceAPI.js';

const props = defineProps({
  shown: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['save', 'close']);

// TODO: get rid of hardcoded values after service selection is implemented
async function save() {
  const catalog = await CatalogAPI.get({itemId: 45})
  const service = await ServiceAPI.get({itemId: 77})

  await emit('save', {catalog: catalog.catalog, service: service});
  close();
}

function close() {
  emit('close');
}
</script>

<style lang="scss" scoped>

</style>
