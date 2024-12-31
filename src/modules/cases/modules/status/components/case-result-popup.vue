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
        :value="reason"
        required
        @input="reason = $event"
      />

      <wt-textarea
        :label="t('cases.result')"
        :value="result"
        @input="result = $event"
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
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import CloseReasonsAPI from '../../result/api/CloseReasonsAPI.js';
import { useStore } from 'vuex';

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

const store = useStore();

const { t } = useI18n();

const reason = ref(null);
const result = ref(null);

const closeReasonId = computed(() => store.getters[`${props.namespace}/service/CLOSE_REASON_ID`]);

async function searchCloseReasons() {
  return await CloseReasonsAPI.getLookup({ closeReasonGroupId: closeReasonId.value });
}

const emit = defineEmits(['save', 'close']);

function save() {
  const finalStatusData = {
    reason: reason.value,
    result: result.value,
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
