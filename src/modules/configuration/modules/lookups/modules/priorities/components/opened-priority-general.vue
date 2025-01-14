<template>
  <section class="opened-priority-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>

    <div class="opened-card-input-grid">
      <wt-input
        :label="t('reusable.name')"
        :value="itemInstance.name"
        :v="v.itemInstance.name"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <div class="opened-card-input-grid__color">
        <wt-icon-wrapper
          :color="itemInstance.color"
          icon="cases"
          size="xl"
        />

        <wt-select
          :label="t('lookups.priorities.color')"
          :options="prioritiesColorsOptions"
          :value="currentPriorityColor"
          :v="v.itemInstance.color"
          required
          option-label="name"
          @input="setItemProp({ path: 'color', value: $event.id })"
        >
          <template #singleLabel="{ option, optionLabel }">
            <div class="color-select-option">
              <color-preview :color="option.id" />

              {{ option[optionLabel] }}
            </div>
          </template>

          <template #option="{ option, optionLabel }">
            <div class="color-select-option">
              <color-preview :color="option.id" />

              {{ option[optionLabel] }}
            </div>
          </template>
        </wt-select>
      </div>

      <wt-textarea
        :label="t('vocabulary.description')"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { kebabToCamel } from '@webitel/ui-sdk/src/scripts/index.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import WtIconWrapper from '../../../../../../../app/components/utils/wt-icon-wrapper/wt-icon-wrapper.vue';
import PrioritiesColors from '../enums/PrioritiesColors.enum.js';
import ColorPreview from './color-preview.vue';

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
const { itemInstance, setItemProp } = useCardStore(props.namespace);

const prioritiesColorsOptions = computed(() => Object.values(PrioritiesColors).map((type) => {
  return {
    id: type,
    name: t(`lookups.priorities.colors.${kebabToCamel(type)}`),
  };
}));

const currentPriorityColor = computed(() => {
  return prioritiesColorsOptions.value.find((type) => type.id === itemInstance.value?.color);
});

onMounted(() => {
  if (!itemInstance.value?.color) {
    setItemProp({ path: 'color', value: prioritiesColorsOptions.value[0].id });
  }
})
</script>

<style lang="scss" scoped>
.opened-card-input-grid {
  &__color {
    display: flex;
    align-items: flex-start;
    grid-gap: 8px;

    .wt-icon {
      margin-top: 25px;
    }
  }

  .color-select-option {
    display: flex;
    grid-gap: 4px;
    align-items: center;
  }
}
</style>
