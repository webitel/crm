<template>
  <div class="case-sla">
    <span class="case-sla__title case-section-title">{{ t('cases.appliedSLA') }}</span>
    <div
      v-if="modelValue.sla"
      class="case-sla__content"
    >
      <div class="case-sla__name typo-body-1">
        <span>{{ modelValue?.sla?.name }}</span>
      </div>
      <template v-if="slaConditionName">
        <div class="case-sla__condition">
          <wt-icon
            color="error"
            icon="stop-sign"
          />
          <span>{{ slaConditionName }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SLAConditionsAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCasesCardStore } from '../../../stores/card/casesCardStore';
import { useCaseServiceStore } from '../../service/stores/caseServiceStore';

const { modelValue } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});

const { t } = useI18n();

const { sla: serviceSLA } = storeToRefs(useCaseServiceStore());

const slaConditionName = computed(
	() => modelValue?.value?.slaCondition?.name || '',
);

const updateSlaCondition = async (slaId, priorityId) => {
	if (!slaId || !priorityId) {
		resetSlaCondition();
		return;
	}
	try {
		const response = await SLAConditionsAPI.getList({
			parentId: slaId,
			priorityId,
		});
		//NOTE: slaConditionsAPI.getList returns an array of items, but we need FIRST item
		modelValue.value.slaCondition = response.items[0];
	} catch (err) {
		resetSlaCondition();
		throw err;
	}
};

const resetSlaCondition = () => {
	modelValue.value.slaCondition = null;
};

const resetSla = () => {
	modelValue.value.sla = null;
};

watch(
	() => serviceSLA.value?.id,
	async (newSlaId) => {
		if (!newSlaId) {
			resetSla();
			return;
		}

		modelValue.value.sla = serviceSLA.value;
		await updateSlaCondition(newSlaId, modelValue.value.priority?.id);
	},
);

watch(
	() => modelValue.value.priority?.id,
	async (newPriorityId) => {
		await updateSlaCondition(serviceSLA.value?.id, newPriorityId);
	},
);
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-sla {
  width: 100%;

  &__title {
    display: block;
    padding: var(--spacing-xs);
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
  }

  &__condition {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__name {
    //TODO: replace bold with actual font-weight after TYPOGRAPHY/body 1 bold is implemented
    font-weight: bold;
  }
}
</style>
