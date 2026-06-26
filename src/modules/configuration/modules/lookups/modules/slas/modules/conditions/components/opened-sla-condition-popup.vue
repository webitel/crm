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
          v-model:model-value="modelValue.name"
          :label="t('reusable.name')"
          :regle-validation="validationFields?.name"
          :disabled="disableUserInput"
          required
        />

        <wt-multi-select
          v-model:model-value="modelValue.priorities"
          :label="t('vocabulary.priority')"
          :regle-validation="validationFields?.priorities"
          :search-method="modelValue.id ? getConditionPriorities : getFreePriorities"
          :disabled="disableUserInput"
          required
        />

        <wt-timepicker
          :label="t('lookups.slas.reactionTime')"
          v-model:model-value="modelValue.reactionTime"
          :regle-validation="validationFields?.reactionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
        />

        <wt-timepicker
          :label="t('lookups.slas.resolutionTime')"
          v-model:="modelValue.resolutionTime"
          :regle-validation="validationFields?.resolutionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
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

<script setup lang="ts">
import { CasePrioritiesAPI } from '@webitel/api-services/api';
import type { WebitelCasesSLACondition } from '@webitel/api-services/gen/models';
import { useNestedCardComponent } from '@webitel/ui-datalist/card';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../../../error-pages/composable/useErrorRedirectHandler';
import { useSLAConditionsCardStore } from '../stores';

const emit = defineEmits([
	'load-data',
]);

const route = useRoute();
const { t } = useI18n();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl({
	useUpdateAccessAsAllMutableChecksSource: true,
});

const { handleError } = useErrorRedirectHandler();

const {
	modelValue,
	validationFields,
	isNew,
	hasValidationErrors,
	save: saveItem,
} = useNestedCardComponent<WebitelCasesSLACondition>({
	useCardStore: useSLAConditionsCardStore,
	routeParamName: 'conditionId',
	parentId: route.params.id,
	onLoadErrorHandler: handleError,
});

const conditionId = computed(() => route.params.conditionId);

const { close } = useClose(`${CrmSections.Slas}-conditions`);

const save = async () => {
	await saveItem();
	close();
	emit('load-data');
};

function getFreePriorities(params) {
	return CasePrioritiesAPI.getLookup({
		...params,
		notInSla: route.params.id,
	});
}

function getConditionPriorities(params) {
	return CasePrioritiesAPI.getLookup({
		...params,
		inSlaCond: modelValue.value?.id,
	});
}
</script>

<style lang="scss" scoped></style>
