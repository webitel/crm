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
      <div class="case-result-popup__main">
        <wt-select
          :label="t('cases.closureReason')"
          :search-method="searchCloseReasons"
          required
          :v="v$.draft.reason"
          :value="draft.reason"
          @input="draft.reason = $event"
        />

        <wt-textarea
          class="case-result-popup__textarea"
          :label="t('cases.result')"
          required
          :v="v$.draft.result"
          :value="draft.result"
          @input="draft.result = $event"
        />
      </div>
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
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import CloseReasonsAPI from '../../result/api/CloseReasonsAPI.js';

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
  'save': [{ result: ReturnType<createDraftData>, reason?: string}],
  'cancel': [],
}>();

const { namespace: cardNamespace } = useCardStore(props.namespace);

const store = useStore();

const { t } = useI18n();

const draft = reactive(createDraftData());

watch(() => props.shown, () => {
  Object.assign(draft, createDraftData());
});

const v$ = useVuelidate(computed(() => {
  return {
    draft: {
      reason: { required },
      result: { required },
    },
  };
}), { draft }, { $autoDirty: true, $stopPropagation: true });

v$.value.$touch();

const closeReasonId = computed(
  () => store.getters[`${cardNamespace}/service/CLOSE_REASON_ID`],
);

async function searchCloseReasons(params) {
  return await CloseReasonsAPI.getLookup({
    closeReasonGroupId: closeReasonId.value,
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
    height: 400px;
  }
}
</style>
