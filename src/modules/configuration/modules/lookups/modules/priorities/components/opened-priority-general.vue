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

      <div class="opened-priority-general-color">
        <case-priority-color-component
          :color="itemInstance.color"
          component-type="wt-icon"
          icon="cases"
          size="xl"
        />

        <wt-select
          :value="itemInstance.color"
          :options="prioritiesColorsOptions"
          :label="t('vocabulary.color')"
          :v="v.itemInstance.color"
          use-value-from-options-by-prop="color"
          required
          option-label="name"
          @input="setItemProp({ path: 'color', value: $event })"
        >
          <template #singleLabel="{ option }">
            <div class="opened-priority-general-color__option">
              <case-priority-color-component
                :color="option"
                component-type="wt-indicator"
              />

              <span class="opened-priority-general-color__name">
                {{ option }}
              </span>
            </div>
          </template>

          <template #option="{ option, optionLabel }">
            <div class="opened-priority-general-color__option">
              <case-priority-color-component
                :color="option.id"
                component-type="wt-indicator"
              />

              <span class="opened-priority-general-color__name">
                {{ option[optionLabel] }}
              </span>
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCardStore } from '@webitel/ui-sdk/store';
import CasePriorityColorComponent from '../../../../../../../app/components/utils/case-priority-color-component.vue';
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
const { itemInstance, setItemProp } = useCardStore(props.namespace);

const prioritiesColorsOptions = computed(() => Object.values(PrioritiesColors).map((type) => {
  return {
    id: type,
    name: type,
  };
}));

const currentPriorityColor = ref('')

function setDefaultColorOption() {
  if (itemInstance.value?.color) {
    return
  }

  setItemProp({ path: 'color', value: prioritiesColorsOptions.value[0].id });
}
setDefaultColorOption()
</script>

<style lang="scss" scoped>
.opened-priority-general {
  &-color {
    display: flex;
    align-items: flex-start;
    grid-gap: var(--spacing-xs);

    .wt-icon {
      margin-top: var(--spacing-md);
    }

    &__option {
      display: flex;
      grid-gap: 4px;
      align-items: center;
    }

    &__name {
      &::first-letter {
        text-transform: uppercase;
      }
    }
  }
}
</style>
