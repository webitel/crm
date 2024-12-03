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
import { serviceCatalogData } from '../api/example.js';

const props = defineProps({
  shown: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['save', 'close']);


function save() {
  emit('save', serviceCatalogData);
  close();
}

function close() {
  emit('close');
}
</script>

<style lang="scss" scoped>

</style>
