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
          class="editable-field__label-icon"
          :color="color"
          :icon="icon"
        />
        <wt-label>
          {{ label }}
        </wt-label>
      </div>
      <div class="editable-field__value-wrapper">
        <wt-icon
          v-if="icon && !horizontalView"
          :color="color"
          :icon="icon"
        />
        <span
          v-if="!link"
          class="editable-field__value"
        >
          {{ valueWithDefault }}
        </span>
        <template v-else>
          <div @click="onLinkAction">
            <wt-item-link
              :link="link"
              :disabled="props.disableLink"
              :class="{ 'editable-field__link_disabled': props.disableLink }"
              class="editable-field__link"
              target="_blank"
            >
              {{ value?.name }}
            </wt-item-link>
          </div>
          <wt-icon
            v-if="showLinkIcon"
            class="editable-field__link-icon"
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
  disableLink: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:value', 'on-link-action']);

const updateValue = (newValue) => {
  emit('update:value', newValue);
};

const valueWithDefault = computed(() => {
  if (typeof props.value === 'object' && props.value !== null) {
    return props.value?.name ?? '-';
  }

  return props.horizontalView ? props.value : props.value || '-';
});

const showLinkIcon = computed(() => props.link && props.value?.name && !props.disableLink)

/**
 * @author @Oleksandr Palonnyi
 *
 * Added this function to rewrite default behaviour of wt-action-link,
 * because of case-persons has logic to redirect to contact card in read-only mode with etag,
 * that get with API by clicking on the link.
 * */
const onLinkAction = (e) => {
  if (props.disableLink) {
    return;
  }

  e.preventDefault()
  e.stopPropagation();
  emit('on-link-action');
}
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.editable-field {
  display: flex;
  flex-direction: column;

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__label-wrapper .wt-label {
    @extend %typo-heading-4;
  }

  &__label-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
  }

  &__value {
    @extend %typo-body-1;
    white-space: pre-line;
  }

  &__value-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
  }

  &__label-wrapper,
  &__value-wrapper {
    padding: var(--spacing-xs);
  }

  &.editable-horizontal-field {
    .editable-field__content {
      gap: var(--spacing-2xs);
      flex-direction: row;
      justify-content: space-between;
    }

    .editable-field__label-wrapper,
    .editable-field__value-wrapper {
      flex: 1;
      padding: 0;
      align-items: flex-start;
    }

    .editable-field__label-wrapper {
      justify-content: start;
    }

    .editable-field__value-wrapper {
      justify-content: end;
    }

    .editable-field__value {
      word-break: break-all;
      @extend %typo-subtitle-1;
    }

    .editable-field__label-wrapper .wt-label {
      text-align: start;
      //TODO: remove bold after proper typography implementation
      font-weight: bold;
      @extend %typo-body-1;
    }

    .editable-field__link {
      word-break: break-all;
      @extend %typo-subtitle-1;
      color: var(--link-color);

      &_disabled {
        color: var(--text-main-color);
      }
    }

    .editable-field__link-icon,
    .editable-field__label-icon {
      flex-shrink: 0;
    }
  }
}
</style>
