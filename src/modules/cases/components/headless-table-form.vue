<template>
  <div class="headless-table-form">
    <div class="headless-table-form__inputs-wrapper">
      <slot/>
    </div>
    <div class="headless-table-form__actions-wrapper">
      <wt-rounded-action
        class="headless-table-form__action"
        icon="tick"
        @click="submit"
      />
      <wt-rounded-action
        class="headless-table-form__action"
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
.headless-table-form {
  display: flex;
  gap: var(--spacing-xs);

  &__inputs-wrapper {
    display: flex;
    gap: 8px;
    flex: 1;
  }

  &__actions-wrapper {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__action {
    padding: var(--spacing-xs);
  }
  &__input {
    flex: 1;
  }
}
</style>
