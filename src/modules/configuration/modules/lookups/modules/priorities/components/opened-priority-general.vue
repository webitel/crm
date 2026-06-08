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
        v-model:model-value="modelValue.name"
        :regle-validation="validationFields?.name"
        :disabled="disableUserInput"
        required
      />

      <div class="opened-priority-general__wrapper">
        <color-component-wrapper
          :color="modelValue.color"
          component="wt-icon"
          icon="cases"
          :size="ComponentSize.XL"
        />

        <wt-single-select
          v-model:model-value="modelValue.color"
          :options="prioritiesColorsOptions"
          :label="t('vocabulary.color')"
          :regle-validation="validationFields?.color"
          :disabled="disableUserInput"
          required
          option-value="id"
          option-label="name"
        >
          <template #value="{ value }">
            <div class="opened-priority-general__wrapper">
              <color-component-wrapper
                :color="value"
                component="wt-indicator"
              />

              <span class="opened-priority-general__color-name">
                {{ value }}
              </span>
            </div>
          </template>

          <template #option="{ option, getOptionLabel }">
            <div class="opened-priority-general__wrapper">
              <color-component-wrapper
                :color="option.id"
                component="wt-indicator"
              />

              <span class="opened-priority-general__color-name">
                {{ getOptionLabel(option) }}
              </span>
            </div>
          </template>
        </wt-single-select>
      </div>

      <wt-textarea
        :disabled="disableUserInput"
        :label="t('vocabulary.description')"
        :model-value="modelValue.description"
        @update:model-value="modelValue.description = $event"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { RegleSchemaFieldStatus } from '@regle/schemas';
import { WebitelCasesPriority } from '@webitel/api-services/gen/models';
import {
	WtInputText,
	WtSingleSelect,
	WtTextarea,
} from '@webitel/ui-sdk/components';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import ColorComponentWrapper from '../../../../../../../app/components/utils/color-component-wrapper.vue';
import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { PrioritiesColors } from '../enums/PrioritiesColors';

import { ComponentSize } from '@webitel/ui-sdk/enums';

const modelValue = defineModel<WebitelCasesPriority>();

defineProps<{
	validationFields: {
		/* keys as in CasePriority, but values are Regle schema objects */
		[K in keyof WebitelCasesPriority]: RegleSchemaFieldStatus<
			WebitelCasesPriority[K]
		>;
	};
}>();

const { t } = useI18n();
const { disableUserInput } = useUserAccessControl();

const prioritiesColorsOptions = computed(() =>
	Object.values(PrioritiesColors).map((type) => {
		return {
			id: type,
			name: type,
		};
	}),
);

watch(
	modelValue,
	(val) => {
		if (val && !val.color) {
			modelValue.value.color = prioritiesColorsOptions.value[0].id;
		}
	},
	{
		once: true,
	},
);
</script>

<style lang="scss" scoped>
.opened-priority-general {
  &__wrapper {
    display: flex;
    align-items: end;
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
