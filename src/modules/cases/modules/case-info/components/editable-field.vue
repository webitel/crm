<template>
  <div
    :class="{ 'editable-horizontal-field': horizontalView }"
    class="editable-field"
  >
    <div
      v-if="!editMode"
      class="editable-field__content"
    >
      <div
        v-if="label"
        class="editable-field__label-wrapper"
      >
        <wt-icon
          v-if="icon && horizontalView"
          :color="color"
          :icon="icon"
        />
        <wt-label>
          {{ label }}
        </wt-label>
      </div>
      <div class="editable-field__value">
        <wt-icon
          v-if="icon && !horizontalView"
          :color="color"
          :icon="icon"
        />
        <span v-if="!link">
          {{ valueWithDefault }}
        </span>
        <template v-else>
          <wt-item-link
            :link="link"
            class="editable-field__link"
            target="_blank"
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
import { computed } from 'vue';

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
  horizontalView: {
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

const valueWithDefault = computed(() => {
  return props.horizontalView ? props.value : props.value || '-';
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

  &__label-wrapper .wt-label {
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

  &__label-wrapper, &__value {
    padding: var(--spacing-xs);
  }

  &.editable-horizontal-field {
    .editable-field__content {
      flex-direction: row;
      justify-content: space-between;
    }

    .editable-field__label-wrapper, .editable-field__value {
      text-align: end;
      padding: 0;
    }

    .editable-field__value span {
      @extend %typo-subtitle-1;
    }

    .editable-field__label-wrapper .wt-label {
      //TODO: remove bold after proper typography implementation
      font-weight: bold;
      @extend %typo-body-1;
    }

    .editable-field__link {
      color: var(--link-color);
    }
  }
}
</style>
