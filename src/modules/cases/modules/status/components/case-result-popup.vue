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
      <wt-select
        :value="draft.reason"
        :label="t('cases.closureReason')"
        :search-method="searchCloseReasons"
        :v="v$.draft.reason"
        required
        @input="draft.reason = $event"
      />

      <wt-textarea
        :label="t('cases.result')"
        :v="v$.draft.result"
        :rows="10"
        :model-value="draft.result"
        required
        @update:model-value="draft.result = $event"
      />
    </template>
    <template #actions>
      <wt-button
        :disabled="v$.$invalid"
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
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { CaseCloseReasonsAPI } from '@webitel/api-services/api';
import { WtTextarea } from '@webitel/ui-sdk/components';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const createDraftData = () => ({
	reason: null,
	result: null,
});

const props = defineProps({
	shown: {
		type: Boolean,
		required: true,
	},
	namespace: {
		type: String,
		required: true,
	},
});

const emit = defineEmits<{
	save: [
		{
			result: ReturnType<createDraftData>;
			reason?: string;
		},
	];
	cancel: [];
}>();

const { namespace: cardNamespace } = useCardStore(props.namespace);

const store = useStore();

const { t } = useI18n();

const draft = reactive(createDraftData());

watch(
	() => props.shown,
	() => {
		Object.assign(draft, createDraftData());
	},
);

const v$ = useVuelidate(
	computed(() => {
		return {
			draft: {
				reason: {
					required,
				},
				result: {
					required,
				},
			},
		};
	}),
	{
		draft,
	},
	{
		$autoDirty: true,
		$stopPropagation: true,
	},
);

v$.value.$touch();

const closeReasonId = computed(
	() => store.getters[`${cardNamespace}/service/CLOSE_REASON_ID`],
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

function cancel() {
	emit('cancel');
}

function save() {
	const finalStatusData = {
		reason: draft.reason,
		result: draft.result,
	};
	emit('save', finalStatusData);
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
