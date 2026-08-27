<template>
  <case-result-popup
    :shown="isResultPopup"
    @save="confirmChangingStatusToFinal"
    @cancel="cancelChangingStatusToFinal"
  />
  <div class="case-status">
    <span class="case-status__title case-section-title">{{ t('cases.status') }}</span>

    <div>
      <!-- NOTE: key is used to force re-render the select component if statusId changed so search-method updates with new statusId -->
      <wt-single-select
        :key="status?.id"
        :disabled="disableStatusSelect"
        :regle-validation="validationFields.statusCondition"
        :placeholder="t('cases.status')"
        :search-method="hasStatusReadAccess && fetchStatusConditions"
        :model-value="displayedStatusCondition"
        strict-api-options
				:show-clear="false"
        class="case-status__select"
        @update:model-value="handleSelect"
      >
        <template #value="{ value }">
          <wt-indicator
            :color="getIndicatorColor(value)"
            :text="value.name"
          />
        </template>

        <template #option="{ option }">
          <wt-indicator
            :color="getIndicatorColor(option)"
            :text="option.name"
          />
        </template>
      </wt-single-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CaseStatusConditionsAPI, CasesAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { WtObject } from '@webitel/ui-sdk/enums';
import { isEmpty } from '@webitel/ui-sdk/scripts';
import { type StoreGeneric, storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import { useCaseAccessState } from '../../../composables/useCaseAccessState';
import { useCasesCardStore } from '../../../stores/card/casesCardStore';
import { useCaseServiceStore } from '../../service/stores/caseServiceStore';
import CaseResultPopup from './case-result-popup.vue';

const { isEditable, isReadOnly } = useCaseAccessState();

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();
const { hasReadAccess: hasStatusReadAccess } = useUserAccessControl(
	WtObject.Status,
);

const disableStatusSelect = computed(
	() => disableUserInput.value || isReadOnly || !hasStatusReadAccess.value,
);

const casesCardStore = useCasesCardStore();
const { itemId } = storeToRefs(casesCardStore as unknown as StoreGeneric);
const { modelValue, validationFields } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});

const isNew = computed(() => !itemId.value);

const isResultPopup = ref(false);

const pendingFinalStatusCondition = ref(null);

const displayedStatusCondition = computed(
	() => pendingFinalStatusCondition.value ?? modelValue.value?.statusCondition,
);

const openCaseResultPopup = () => {
	isResultPopup.value = true;
};

const closeCaseResultPopup = () => {
	isResultPopup.value = false;
};

const startChangingStatusToFinal = (statusCondition) => {
	pendingFinalStatusCondition.value = statusCondition;
	openCaseResultPopup();
};

async function reloadCase() {
	await casesCardStore.initialize({
		itemId: itemId.value,
	});
}

const confirmChangingStatusToFinal = async ({ reason, result }) => {
	modelValue.value.closeReason = reason;
	modelValue.value.closeResult = result;

	await patchStatusCondition(pendingFinalStatusCondition.value);

	if (!isEditable.value) {
		await CasesAPI.patch({
			changes: {
				closeReason: reason,
				closeResult: result,
			},
			etag: modelValue.value.etag,
		});

		//NOTE: needed to get new etag so new patch will work correctly
		await reloadCase();
	}

	pendingFinalStatusCondition.value = null;
	closeCaseResultPopup();
};

const cancelChangingStatusToFinal = () => {
	pendingFinalStatusCondition.value = null;
	closeCaseResultPopup();
};

const getIndicatorColor = (option) => {
	if (option?.final) return 'final-status';
	if (option?.initial) return 'initial-status';
	return 'other-status';
};

const { status } = storeToRefs(useCaseServiceStore());

const fetchStatusConditions = async (params = {}) => {
	if (!status?.value?.id) {
		return {
			items: [],
		};
	}

	return await CaseStatusConditionsAPI.getLookup({
		statusId: status.value.id,
		...params,
		fields: [
			'id',
			'name',
			'initial',
			'final',
		],
	});
};

async function patchStatusCondition(condition) {
	updateLocalProperties(condition);

	if (!isNew.value && !isEditable.value) {
		await patchRemoteChanges(condition);
		await reloadCase();
	}
}

function updateLocalProperties(condition) {
	modelValue.value.statusCondition = condition;
	modelValue.value.status = status.value;

	if (isEditable.value && !condition.final) {
		modelValue.value.closeReason = {};
		modelValue.value.closeResult = '';
	}
}

async function patchRemoteChanges(condition) {
	const changes: Record<string, unknown> = {
		statusCondition: condition,
		status: status.value,
	};

	if (!condition.final) {
		changes.closeReason = {};
		changes.closeResult = '';
	}

	await CasesAPI.patch({
		changes,
		etag: modelValue.value.etag,
	});
}

async function handleSelect(selectedStatusCondition) {
	if (selectedStatusCondition.final) {
		startChangingStatusToFinal(selectedStatusCondition);
	} else if (/* at reset */ isEmpty(selectedStatusCondition)) {
		const { items } = await fetchStatusConditions();
		const initialStatusCondition = items.find(({ initial }) => initial);
		await handleSelect(initialStatusCondition);
	} else {
		await patchStatusCondition(selectedStatusCondition);
	}
}

async function updateStatusCondition(isValidationRequired = true) {
	if (!hasStatusReadAccess.value || !status?.value?.id) {
		return;
	}

	if (isValidationRequired && modelValue.value.statusCondition?.id) return;

	if (!isValidationRequired && modelValue.value.statusCondition?.initial) {
		modelValue.value.statusCondition = {};
	}

	const { items } = await CaseStatusConditionsAPI.getList({
		statusId: status.value.id,
	});

	const initialCondition = items.find((item) => item.initial);
	if (initialCondition) {
		await patchStatusCondition(initialCondition);
	}
}

watch(
	() => status.value?.id,
	async (newStatusId, oldStatusId) => {
		if (
			!newStatusId ||
			(modelValue.value.statusCondition?.final && !isNew.value)
		)
			return;

		// NOTE: on initial mount (oldStatusId === undefined) we want to skip only if there's already a statusCondition.id, on any subsequent status-change we force the reset
		const validationRequired = oldStatusId === undefined;

		await updateStatusCondition(validationRequired);
	},
	{
		immediate: true,
	},
);
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-status {
  width: 100%;

  &__title {
    display: block;
  }

  &__select,
  &__title {
    padding: var(--spacing-xs);
  }
}
</style>
