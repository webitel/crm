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
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <div class="opened-card-input-grid__color">
        <wt-icon icon="cases" />

        <wt-select
          :label="t('lookups.priorities.color')"
          :options="prioritiesColorsOptions"
          :value="currentPriorityColor"
          required
          option-label="name"
          @input="setItemProp({ path: 'color', value: $event.id })"
        >
          <template #singleLabel="{ option, optionLabel }">
            <div class="color-select-option">
              <wt-badge :color-variable="`${option.id}-darken-2`" />

              {{ option[optionLabel] }}
            </div>
          </template>

          <template #option="{ option, optionLabel }">
            <div class="color-select-option">
              <wt-badge :color-variable="`${option.id}-darken-2`" />

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
import { kebabToCamel } from '@webitel/ui-sdk/src/scripts/index.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import PrioritiesColors from '../enums/PrioritiesColors.enum.js';

const props = defineProps({
  namespace: {
    type: String,
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
    align-items: flex-end;
    grid-gap: 8px;

    .wt-icon {
      width: 40px;
      height: 40px;
    }
  }

  .color-select-option {
    display: flex;
    grid-gap: 8px;
    align-items: center;

    .wt-badge {
      position: relative;
      width: 16px;
      height: 16px;
    }
  }
}
</style>
