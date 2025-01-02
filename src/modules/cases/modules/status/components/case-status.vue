<template>
  <case-result-popup
    :namespace="props.namespace"
    :shown="isResultPopup"
    @close="isResultPopup = false"
    @save="saveResult"
  />
  <div class="case-status">
    <div>
      <!-- NOTE: key is used to force re-render the select component if statusId changed so search-method updates with new statusId -->
      <wt-select
        :key="statusId"
        :clearable="false"
        :placeholder="t('cases.status')"
        :search-method="fetchStatusConditions"
        :value="itemInstance?.statusCondition"
        @input="handleSelect"
      >
        <template #singleLabel="{ option }">
          <wt-indicator
            :color="getIndicatorColor(option)"
            :text="option.name"
          />
        </template>
        <template #option="{ option }">
          <wt-indicator
            :color="getIndicatorColor(option)"
            :text="option.name"
          />
        </template>
      </wt-select>
    </div>
  </div>
</template>

<script setup>
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import CasesAPI from '../../../api/CasesAPI.js';
import StatusConditionsAPI from '../api/StatusConditionsAPI.js';
import StatusesAPI from '../api/StatusesAPI.js';
import CaseResultPopup from './case-result-popup.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const store = useStore();

const {
  namespace: cardNamespace,
  id,
  itemInstance,

  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
  setItemProp,
  deleteItem,
} = useCardStore(props.namespace);

const {
  isNew,
  pathName,
  disabledSave,
  saveText,
  save,
  initialize,
} = useCardComponent({
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
});

const isResultPopup = ref(false);

async function saveResult({ reason, result }) {
  await setItemProp({
    path: 'close.closeReason',
    value: reason,
  });
  await setItemProp({
    path: 'close.closeResult',
    value: result,
  });
}

function getIndicatorColor(option) {
  if (option?.initial) return 'initial-status';
  if (option?.final) return 'final-status';
  return 'other-status';
}

const statusId = computed(() => store.getters[`${props.namespace}/service/STATUS_ID`]);

const fetchStatusConditions = async (params) =>
  await StatusConditionsAPI.getLookup({
    ...params,
    statusId: statusId.value,
  });

async function handleSelect(value) {
  if (value.final) isResultPopup.value = true;

  try {
    const statusResponse = await StatusesAPI.get({ itemId: statusId.value });
    const status = {
      id: statusResponse.id,
      name: statusResponse.name,
    };
    await setItemProp({
      path: 'status',
      value: status,
    });
    await setItemProp({
      path: 'statusCondition',
      value,
    });
    await CasesAPI.patch({
      itemId: id.value,
      itemInstance: {
        statusCondition: value,
        status,
      },
    });
  } catch (err) {
    throw err;
  }
}

async function updateStatusCondition() {
  if (!statusId.value && !itemInstance.value.statusCondition) return;

  try {
    const { items } = await StatusConditionsAPI.getList({ statusId: statusId.value });

    const initialCondition = items.find((item) => item.initial);

    await setItemProp({
      path: 'statusCondition',
      value: initialCondition,
    });

    await CasesAPI.patch({
      itemId: id.value,
      itemInstance: {
        statusCondition: initialCondition,
      },
    });
  } catch (err) {
    throw err;
  }
}

watch(statusId, updateStatusCondition);
</script>

<style lang="scss" scoped>
.case-status {
  width: 100%;
}
</style>
