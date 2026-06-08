<template>
  <wt-popup
    class="opened-sla-condition-popup"
    :shown="!!conditionId"
    size="sm"
    overflow
    @close="close"
  >
    <template #title>
      {{ !isNew ? t('lookups.slas.editCondition') : t('lookups.slas.addCondition') }}
    </template>
    <template #main>
      <form
        class="opened-card-input-grid opened-card-input-grid--1-col"
        @submit.prevent="save"
      >
        <wt-input-text
          v-model="draftItemInstance.name"
          :label="t('reusable.name')"
          :regle-validation="validationSchema.r$.name"
          :disabled="disableUserInput"
          required
        />
        <wt-multi-select
          v-model="draftItemInstance.priorities"
          :label="t('vocabulary.priority')"
          :search-method="isNew ? getFreePriorities : getConditionPriorities"
          :disabled="disableUserInput"
          :regle-validation="validationSchema.r$.priorities"
          required
        />
        <wt-timepicker
          :model-value="draftItemInstance.reactionTime"
          :label="t('lookups.slas.reactionTime')"
          :regle-validation="validationSchema.r$.reactionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @update:model-value="draftItemInstance.reactionTime = +$event"
        />

        <wt-timepicker
          :model-value="draftItemInstance.resolutionTime"
          :label="t('lookups.slas.resolutionTime')"
          :regle-validation="validationSchema.r$.resolutionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @update:model-value="draftItemInstance.resolutionTime = +$event"
        />
      </form>
    </template>
    <template #actions>
      <wt-button
        :disabled="!hasSaveActionAccess || hasValidationErrors"
        @click="save"
      >
        {{ t('reusable.save') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script lang="ts" setup>
import { CasePrioritiesAPI } from '@webitel/api-services/api';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { useSLAConditionsCardStore } from '../stores';

const emit = defineEmits([
	'load-data',
]);

const route = useRoute();
const { t } = useI18n();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl({
	useUpdateAccessAsAllMutableChecksSource: true,
});

const cardStore = useSLAConditionsCardStore();

const { draftItemInstance, validationSchema } = storeToRefs(cardStore);
const { initialize, saveItem, $reset } = cardStore;

const conditionId = computed(() => route.params.conditionId);
const isNew = computed(() => conditionId.value === 'new');
const slaId = computed(() => route.params.id);

const { close } = useClose(`${CrmSections.Slas}-conditions`);

const hasValidationErrors = computed(() => validationSchema.value.r$.$error);

function getFreePriorities(params) {
	return CasePrioritiesAPI.getLookup({
		...params,
		notInSla: slaId.value,
	});
}

function getConditionPriorities(params) {
	return CasePrioritiesAPI.getLookup({
		...params,
		inSlaCond: conditionId.value,
	});
}

const save = async () => {
	const { valid, data } = await validationSchema.value.r$.$validate();
	if (!valid) return;

	await saveItem(data);
	close();
	emit('load-data');
};

async function initializePopup() {
	await initialize({
		itemId: isNew.value ? null : conditionId.value,
		parentId: slaId.value,
	});
}

watch(
	conditionId,
	(value) => {
		if (value) {
			initializePopup();
		} else {
			$reset();
		}
	},
	{
		immediate: true,
	},
);
</script>

<style
  lang="scss"
  scoped
></style>
