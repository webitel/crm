<template>
  <div
    :class="{ 'editable-field--list-mode': listView }"
    class="editable-field"
  >
    <div
      v-if="!editMode"
      class="editable-field__content"
    >
      <div class="editable-field__label-wrapper">
        <wt-icon
          v-if="icon"
          :icon="icon"
          :color="color"
        />
        <wt-label
          v-if="label"
        >
          {{ label }}
        </wt-label>
      </div>
      <div class="editable-field__value">
        <span v-if="!link">
          {{ value }}
        </span>
        <template v-else>
          <wt-item-link
            :link="link"
            class="editable-field__link"
          >
            {{ value }}
          </wt-item-link>
          <wt-icon
            v-if="link && value"
            icon="link"
            size="sm"
          />
        </template>
      </div>
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
  listView: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '',
  },
  link: {
    type: Object,
    default: null,
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

  &__label .wt-label {
    @extend %typo-heading-4
  }

  &__label-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
  }

  &__value span {
    @extend %typo-body-1
  }

  &__value {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
  }

  &__label, &__value {
    padding: var(--spacing-xs);
  }

  &--list-mode {
    .editable-field__content {
      flex-direction: row;
      justify-content: space-between;
    }

    .editable-field__label-wrapper .wt-label {
      font-weight: bold;
      @extend %typo-body-1;
    }

    .editable-field__link {
      color: var(--link-color);
    }
  }
}
</style>
