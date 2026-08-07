<template>
  <div class="case-result">
    <div class="opened-card-input-grid opened-card-input-grid--1-col">
      <editable-field
        v-model="modelValue.closeReason"
        :edit-mode="editMode"
        :label="t('cases.closureReason')"
      >
        <template #default="props">
          <wt-single-select
            v-bind="props"
            :model-value="props.modelValue"
            :key="closeReasonId"
            :disabled="disableUserInput || !modelValue.statusCondition?.final"
            required
            :regle-validation="validationFields.closeReason"
            :search-method="searchCloseReasons"
            @update:model-value="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        v-model="modelValue.closeResult"
        :edit-mode="editMode"
        :label="t('cases.result')"
      >
        <template #default="props">
          <wt-textarea
            v-bind="props"
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
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import { useCaseAccessState } from '../../../composables/useCaseAccessState';
import { useCasesCardStore } from '../../../stores/card/casesCardStore';
import EditableField from '../../case-info/components/editable-field.vue';
import { useCaseServiceStore } from '../../service/stores/caseServiceStore';

const { editMode } = useCaseAccessState();

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();

const { modelValue, validationFields } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});
const { closeReasonId } = storeToRefs(useCaseServiceStore());

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
