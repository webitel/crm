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

      <div class="opened-priority-general__color">
        <color-component-wrapper
          class="opened-priority-general__color-icon"
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
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ColorComponentWrapper from '../../../../../../../app/components/utils/color-component-wrapper.vue';
import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { PrioritiesColors } from '../enums/PrioritiesColors';

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
  // The icon is taken out of flow and pinned next to the select input.
  // Otherwise it shifts down when the validation message appears below the
  // select and stretches its height.
  &__color {
    position: relative;
    padding-left: calc(var(--icon-xl-size) + var(--spacing-xs));
  }

  &__color-icon {
    position: absolute;
    left: 0;
    top: calc(var(--spacing-2xs) * 2 + 16px); // wt-label height above the input

    &.case-priority-color-component {
      display: flex;
    }
  }

  &__wrapper {
    display: flex;
    align-items: end;
    gap: var(--spacing-xs);
  }

  &__color-name {
    &::first-letter {
      text-transform: uppercase;
    }
  }
}
</style>
