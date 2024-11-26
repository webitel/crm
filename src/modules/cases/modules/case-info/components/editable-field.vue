<template>
  <div class="editable-field">
    <div
      v-if="!editMode"
      class="editable-field__value"
    >
      <label class="editable-field__label">{{ label }}</label>
      <span class="editable-field__value">{{ value }}</span>
    </div>
    <div
      v-else
      class="editable-field__content"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  editMode: {
    type: Boolean,
    default: false,
  },
  value: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
});

</script>

<style lang="scss" scoped>
.editable-field {
  display: flex;
  flex-direction: column;

  &__value {
    display: flex;
    flex-direction: column;
  }

  &__label {
    @extend %typo-heading-4
  }

  &__value {
    @extend %typo-body-1
  }

  &__label, &__value {
    padding: var(--spacing-xs);
  }
}

</style>
