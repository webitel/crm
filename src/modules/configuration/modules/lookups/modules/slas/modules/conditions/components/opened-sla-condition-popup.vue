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
          :search-method="prioritiesSearchMethod"
          :disabled="disableUserInput || !hasPrioritiesReadAccess"
          :regle-validation="validationFields?.priorities"
          required
        />
        <wt-timepicker
          :model-value="modelValue.reactionTime"
          :label="t('lookups.slas.reactionTime')"
          :regle-validation="validationFields?.reactionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @update:model-value="modelValue.reactionTime = +$event"
        />

        <wt-timepicker
          :model-value="modelValue.resolutionTime"
          :label="t('lookups.slas.resolutionTime')"
          :regle-validation="validationFields?.resolutionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @update:model-value="modelValue.resolutionTime = +$event"
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
import type { WebitelCasesSLACondition } from '@webitel/api-services/gen/models';
import { useNestedCardComponent } from '@webitel/ui-datalist/card';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections, WtObject } from '@webitel/ui-sdk/enums';
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
const { hasReadAccess: hasPrioritiesReadAccess } = useUserAccessControl(
	WtObject.Priorities,
);

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
	parentId: route.params.id as string,
	onLoadErrorHandler: handleError,
});

const conditionId = computed(() => route.params.conditionId);
const slaId = computed(() => route.params.id);

const { close } = useClose(`${CrmSections.Slas}-conditions`);

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

const prioritiesSearchMethod = computed(() => {
	if (!hasPrioritiesReadAccess.value) return false;
	return isNew.value ? getFreePriorities : getConditionPriorities;
});

const save = async () => {
	await saveItem();
	close();
	emit('load-data');
};
</script>

<style
  lang="scss"
  scoped
></style>
