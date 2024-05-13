<template>
  <div ref="intersectionTarget" />
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core';
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  next: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits([
  'next',
]);

const intersectionTarget = ref(null);

let stopIntersectionObserver;

onMounted(() => {
  /**
   *
   * Note, observer triggers at init, so it should be used also as init function
   * however, current filters module version is initializing list by itself, so we need to refactor filters ASAP
   */
  stopIntersectionObserver = useIntersectionObserver(intersectionTarget.value, ([{ isIntersecting }]) => {
    if (isIntersecting && next.value) {
      emit('next');
    }
  });
});

onUnmounted(() => {
  stopIntersectionObserver();
});
</script>

<style scoped lang="scss">

</style>
