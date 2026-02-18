<template>
  <div class="case-sla">
    <span class="case-sla__title typo-heading-4">{{ t('cases.appliedSLA') }}</span>
    <div
      v-if="itemInstance.sla"
      class="case-sla__content"
    >
      <div class="case-sla__name typo-body-1">
        <span>{{ itemInstance?.sla?.name }}</span>
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

<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, inject, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import ConditionsAPI from '../../../../configuration/modules/lookups/modules/slas/modules/conditions/api/conditions.js';

const namespace = inject('namespace');

const {
	namespace: cardNamespace,

	itemInstance,
	setItemProp,
} = useCardStore(namespace);

const { t } = useI18n();

const store = useStore();
const serviceSLA = computed(
	() => store.getters[`${cardNamespace}/service/SLA`],
);

const slaConditionName = computed(
	() => itemInstance?.value?.slaCondition?.name || '',
);

const updateSlaCondition = async (slaId, priorityId) => {
	if (!slaId || !priorityId) {
		await resetSlaCondition();
		return;
	}
	try {
		const response = await ConditionsAPI.getList({
			parentId: slaId,
			priorityId,
		});
		//NOTE: slaConditionsAPI.getList returns an array of items, but we need FIRST item
		await setItemProp({
			path: 'slaCondition',
			value: response.items[0],
		});
	} catch (err) {
		await resetSlaCondition();
		throw err;
	}
};

const resetSlaCondition = async () => {
	await setItemProp({
		path: 'slaCondition',
		value: null,
	});
};

const resetSla = async () => {
	await setItemProp({
		path: 'sla',
		value: null,
	});
};

watch(
	() => serviceSLA.value?.id,
	async (newSlaId) => {
		if (!newSlaId) {
			await resetSla();
			return;
		}

		await setItemProp({
			path: 'sla',
			value: serviceSLA.value,
		});
		await updateSlaCondition(newSlaId, itemInstance.value.priority?.id);
	},
);

watch(
	() => itemInstance.value.priority?.id,
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
