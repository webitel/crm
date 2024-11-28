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
import { service } from '../api/example.js';
import { ref } from 'vue';

const emit = defineEmits(['save']);

const shown = ref(true);

function save() {
  close();
  emit('save', service);
}

function close() {
  shown.value = false;
}
</script>

<style lang="scss" scoped>

</style>
