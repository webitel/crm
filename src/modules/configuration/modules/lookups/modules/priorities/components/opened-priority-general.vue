<template>
  <section class="opened-priority-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>

    <div class="opened-card-input-grid">
      <wt-input-text
        :label="t('reusable.name')"
        :model-value="itemInstance.name"
        :v="v.itemInstance.name"
        :disabled="disableUserInput"
        required
        @update:model-value="setItemProp({ path: 'name', value: $event })"
      />

      <div class="opened-priority-general__wrapper">
        <color-component-wrapper
          :color="itemInstance.color"
          component="wt-icon"
          icon="cases"
          size="xl"
        />

        <wt-select
          :value="itemInstance.color"
          :options="prioritiesColorsOptions"
          :label="t('vocabulary.color')"
          :v="v.itemInstance.color"
          :disabled="disableUserInput"
          use-value-from-options-by-prop="id"
          required
          option-label="name"
          @input="setItemProp({ path: 'color', value: $event })"
        >
          <template #singleLabel="{ option, optionLabel }">
            <div class="opened-priority-general__wrapper">
              <color-component-wrapper
                :color="option.id"
                component="wt-indicator"
              />

              <span class="opened-priority-general__color-name">
                {{ option[optionLabel] }}
              </span>
            </div>
          </template>

          <template #option="{ option, optionLabel }">
            <div class="opened-priority-general__wrapper">
              <color-component-wrapper
                :color="option.id"
                component="wt-indicator"
              />

              <span class="opened-priority-general__color-name">
                {{ option[optionLabel] }}
              </span>
            </div>
          </template>
        </wt-select>
      </div>

      <wt-textarea
        :disabled="disableUserInput"
        :label="t('vocabulary.description')"
        :model-value="itemInstance.description"
        @update:model-value="setItemProp({ path: 'description', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import ColorComponentWrapper from '../../../../../../../app/components/utils/color-component-wrapper.vue';
import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import PrioritiesColors from '../enums/PrioritiesColors.enum.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  v: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const { disableUserInput } = useUserAccessControl();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

const prioritiesColorsOptions = computed(() =>
  Object.values(PrioritiesColors).map((type) => {
    return {
      id: type,
      name: type,
    };
  }),
);

function setDefaultColorOption() {
  if (itemInstance.value?.color) {
    return;
  }

  setItemProp({ path: 'color', value: prioritiesColorsOptions.value[0].id });
}
setDefaultColorOption();
</script>

<style lang="scss" scoped>
.opened-priority-general {
  &__wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);

    .case-priority-color-component {
      display: flex;
    }
  }

  &__color-name {
    &::first-letter {
      text-transform: uppercase;
    }
  }
}
</style>
