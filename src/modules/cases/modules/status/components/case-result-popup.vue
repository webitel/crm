<template>
  <wt-popup
    :shown="shown"
    @close="close"
  >
    <template #header>
      {{ t('cases.caseResult') }}
    </template>
    <template #main>
      <wt-select
        :label="t('cases.reason')"
        :search-method="searchCloseReasons"
        :value="draft.reason"
        required
        @input="draft.reason = $event"
      />

      <wt-textarea
        :label="t('cases.result')"
        :value="draft.result"
        @input="draft.result = $event"
      />
    </template>
    <template #actions>
      <wt-button
        @click="save"
      >
        {{ t('reusable.ok') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CloseReasonsAPI from '../../result/api/CloseReasonsAPI.js';
import { useStore } from 'vuex';
import {
  useCardStore
} from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';

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


const {
  namespace: cardNamespace,
} = useCardStore(props.namespace);

const store = useStore();

const { t } = useI18n();

const draft = reactive({
  reason: null,
  result: null,
});

const closeReasonId = computed(() => store.getters[`${cardNamespace}/service/CLOSE_REASON_ID`]);

async function searchCloseReasons(params) {
  return await CloseReasonsAPI.getLookup({ closeReasonGroupId: closeReasonId.value, ...params });
}

const emit = defineEmits(['save', 'close']);

function save() {
  const finalStatusData = {
    reason: draft.reason,
    result: draft.result,
  };
  emit('save', finalStatusData);
  close();
}

function close() {
  emit('close');
}
</script>

<style lang="scss" scoped>

</style>
