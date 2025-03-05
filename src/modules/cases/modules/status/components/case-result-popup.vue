<template>
  <wt-popup
    class="case-result-popup"
    :shown="shown"
    @close="close"
  >
    <template #header>
      {{ t('cases.caseResult') }}
    </template>
    <template #main>
      <div class="case-result-popup__main">
        <wt-select
          :label="t('cases.reason')"
          :search-method="searchCloseReasons"
          :value="draft.reason"
          required
          @input="draft.reason = $event"
        />

        <wt-textarea
          class="case-result-popup__textarea"
          :label="t('cases.result')"
          :value="draft.result"
          @input="draft.result = $event"
        />
      </div>
    </template>
    <template #actions>
      <wt-button @click="save">
        {{ t('reusable.ok') }}
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

<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import CloseReasonsAPI from '../../result/api/CloseReasonsAPI.js';

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

const { namespace: cardNamespace } = useCardStore(props.namespace);

const store = useStore();

const { t } = useI18n();

const draft = reactive({
  reason: null,
  result: null,
});

const closeReasonId = computed(
  () => store.getters[`${cardNamespace}/service/CLOSE_REASON_ID`],
);

async function searchCloseReasons(params) {
  return await CloseReasonsAPI.getLookup({
    closeReasonGroupId: closeReasonId.value,
    ...params,
  });
}

const emit = defineEmits(['save', 'close', 'update:show']);

function save() {
  const finalStatusData = {
    reason: draft.reason,
    result: draft.result,
  };
  emit('save', finalStatusData);
  emit('update:show', false);
}

function close() {
  emit('close');
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
