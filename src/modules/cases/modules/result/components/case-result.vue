<template>
  <div class="case-result">
    <div class="opened-card-input-grid opened-card-input-grid--1-col">
      <editable-field
        :model-value="modelValue.closeReason"
        :edit-mode="isEditable"
        :label="t('cases.closureReason')"
        @update:model-value="modelValue.closeReason = $event"
      >
        <template #default="props">
          <wt-single-select
            :label="props.label"
            :model-value="props.modelValue"
            :key="closeReasonId"
            :disabled="isCloseReasonDisabled"
            required
            :regle-validation="validationFields.closeReason"
            :search-method="hasCloseReasonGroupsReadAccess && searchCloseReasons"
            @update:model-value="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :model-value="modelValue.closeResult"
        :edit-mode="isEditable"
        :label="t('cases.result')"
        @update:model-value="modelValue.closeResult = $event"
      >
        <template #default="props">
          <wt-textarea
            :label="props.label"
            required
            :regle-validation="validationFields.closeResult"
            :disabled="disableUserInput || !modelValue.statusCondition?.final"
            :model-value="props.modelValue"
            @update:model-value="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <div class="opened-card-input-grid">
        <editable-field
          :label="t('cases.rating')"
          :model-value="modelValue.rating"
        />

        <editable-field
          :label="t('cases.ratingComment')"
          :model-value="modelValue.ratingComment"
        />
      </div>
    </div>
    </div>
</template>
<script setup lang="ts">
import { CaseCloseReasonsAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { WtObject } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import { useCaseAccessState } from '../../../composables/useCaseAccessState';
import { useCasesCardStore } from '../../../stores/card/casesCardStore';
import EditableField from '../../case-info/components/editable-field.vue';
import { useCaseServiceStore } from '../../service/stores/caseServiceStore';

const { isEditable } = useCaseAccessState();

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();
const { hasReadAccess: hasCloseReasonGroupsReadAccess } = useUserAccessControl(
	WtObject.CloseReasonGroup,
);

const { modelValue, validationFields } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});
const { closeReasonId } = storeToRefs(useCaseServiceStore());

const isCloseReasonDisabled = computed(
	() =>
		disableUserInput.value ||
		!modelValue.value.statusCondition?.final ||
		!hasCloseReasonGroupsReadAccess.value,
);

async function searchCloseReasons(params) {
	if (!closeReasonId.value) {
		return {
			items: [],
		};
	}
	return await CaseCloseReasonsAPI.getLookup({
		parentId: closeReasonId.value,
		...params,
	});
}
</script>
<style lang="scss" scoped>
</style>
