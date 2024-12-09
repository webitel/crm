<template>
  <div class="editable-field">
    <div
      v-if="!editMode"
      class="editable-field__content"
    >
      <wt-label
        v-if="label"
        class="editable-field__label"
      >
        {{ label }}
      </wt-label>
      <span class="editable-field__value">{{ value }}</span>
    </div>
    <div v-else>
      <slot
        :label="label"
        :required="required"
        :update-value="updateValue"
        :value="value"
      />
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
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:value']);

const updateValue = (newValue) => {
  emit('update:value', newValue);
};

</script>

<style lang="scss" scoped>
.editable-field {
  display: flex;
  flex-direction: column;

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__label.wt-label {
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
