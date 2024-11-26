<template>
  <div class="editable-field">
    <div
      v-if="!editMode"
      class="editable-field__value"
    >
      <label>{{ label }}</label>
      <span>{{ value }}</span>
    </div>
    <div v-else class="editable-field__slot">
      <slot></slot>
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

    label {
      @extend %typo-heading-4
    }

    span {
      @extend %typo-body-1
    }

    label, span {
      padding: var(--spacing-xs);
    }
  }
}

</style>
