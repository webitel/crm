<template>
  <span>{{ path }}</span>
</template>

<script setup>
import { ref, watchEffect } from 'vue';

import { fetchAndBuildServicePath } from './servicePathHelper.js';


const props = defineProps({
  serviceId: {
    type: [String, Number],
    required: true,
  },
  initialName: {
    type: String,
    default: '...',
  },
});

const path = ref(props.initialName);

watchEffect(async () => {
  if (props.serviceId) {
    path.value = await fetchAndBuildServicePath(props.serviceId);
  } else {
    path.value = ''; // Якщо ID немає, показуємо пустий рядок
  }
});
</script>
