<template>
  <form
    class="table-top-row-bar"
    @submit.prevent="submit"
  >
    <slot />
    <wt-rounded-action
      icon="tick"
      @click="submit"
    />
    <wt-rounded-action
      icon="close"
      @click="reset"
    />
  </form>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['submit', 'reset']);

function submit() {
  emit('submit');
}

function reset() {
  emit('reset');
}
</script>

<style lang="scss" scoped>
.table-top-row-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  .wt-rounded-action {
    flex: 0 0 auto;
  }
}
</style>
