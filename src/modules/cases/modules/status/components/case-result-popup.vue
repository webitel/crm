<template>
  <wt-popup
    class="case-result-popup"
    :shown="shown"
    @close="cancel"
  >
    <template #header>
      {{ t('cases.caseResult') }}
    </template>
    <template #main>
      <wt-single-select
        v-model:model-value="draft.reason"
        :label="t('cases.closureReason')"
        :search-method="searchCloseReasons"
        :regle-validation="validationFields.reason"
        required
      />

      <wt-textarea
        :label="t('cases.result')"
        :regle-validation="validationFields.result"
        :rows="10"
        :model-value="draft.result"
        required
        @update:model-value="draft.result = $event"
      />
    </template>
    <template #actions>
      <wt-button
        :disabled="hasValidationErrors"
        @click="save"
      >
        {{ t('reusable.ok') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="cancel"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script lang="ts" setup>
import { useRegleSchema } from '@regle/schemas';
import { CaseCloseReasonsAPI } from '@webitel/api-services/api';
import {
	type CaseClose,
	caseCloseSchema,
} from '@webitel/api-services/validations';
import { WtTextarea } from '@webitel/ui-sdk/components';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCaseServiceStore } from '../../service/stores/caseServiceStore';

const createDraftData = (): CaseClose => ({
	reason: null,
	result: null,
});

const props = defineProps<{
	shown: boolean;
}>();

const emit = defineEmits<{
	save: [
		CaseClose,
	];
	cancel: [];
}>();

const { t } = useI18n();

const draft = ref<CaseClose>(createDraftData());

watch(
	() => props.shown,
	() => {
		draft.value = createDraftData();
	},
);

const validationSchema = ref(
	useRegleSchema(draft, caseCloseSchema, {
		autoDirty: true,
		syncState: {
			onValidate: true,
		},
	}),
);

const validationFields = computed(() => validationSchema.value.r$.$fields);
const hasValidationErrors = computed(() => validationSchema.value.r$.$error);
const validate = () => validationSchema.value.r$.$validate();

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

function cancel() {
	emit('cancel');
}

async function save() {
	const { valid, data } = await validate();
	if (!valid) return;

	emit('save', data);
}
</script>

<style lang="scss" scoped>
.case-result-popup {
  &__main {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
