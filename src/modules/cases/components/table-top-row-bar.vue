<template>
  <div class="table-top-row-bar">
    <div class="table-top-row-bar__inputs-wrapper">
      <slot/>
    </div>
    <div class="table-top-row-bar__actions-wrapper">
      <wt-rounded-action
        class="table-top-row-bar__action"
        icon="tick"
        @click="submit"
      />
      <wt-rounded-action
        class="table-top-row-bar__action"
        icon="close"
        @click="reset"
      />
    </div>
  </div>
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

<style scoped lang="scss">
.table-top-row-bar {
  display: flex;
  gap: var(--spacing-xs);

  &__inputs-wrapper {
    display: flex;
    gap: var(--spacing-xs);
    flex: 1;
  }

  &__actions-wrapper {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__action {
    padding: var(--spacing-xs);
  }
}
</style>
