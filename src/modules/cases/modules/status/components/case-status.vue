<template>
  <case-result-popup
    :namespace="namespace"
    :shown="isResultPopup"
    @close="isResultPopup = false"
    @save="saveResult"
  />
  <div class="case-status">
    <span class="case-status__title">{{ t('cases.status') }}</span>

    <div>
      <!-- NOTE: key is used to force re-render the select component if statusId changed so search-method updates with new statusId -->
      <wt-select
        :key="status?.id"
        :clearable="false"
        :placeholder="t('cases.status')"
        :search-method="fetchStatusConditions"
        :value="itemInstance?.statusCondition"
        class="case-status__select"
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
import { computed, inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import CasesAPI from '../../../api/CasesAPI.js';
import StatusConditionsAPI from '../api/StatusConditionsAPI.js';
import CaseResultPopup from './case-result-popup.vue';

const namespace = inject('namespace');
const editMode = inject('editMode');

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
} = useCardStore(namespace);

const { isNew } = useCardComponent({
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
});

const isResultPopup = ref(false);

const saveResult = async ({ reason, result }) => {
  await setItemProp({
    path: 'close.closeReason',
    value: reason,
  });
  await setItemProp({
    path: 'close.closeResult',
    value: result,
  });
};

const getIndicatorColor = (option) => {
  if (option?.final) return 'final-status';
  if (option?.initial) return 'initial-status';
  return 'other-status';
};

const status = computed(() => store.getters[`${cardNamespace}/service/STATUS`]);

const fetchStatusConditions = async (params) => {
  if (!status?.value?.id) {
    return { items: [] };
  }

  return await StatusConditionsAPI.getLookup({
    statusId: status.value.id,
    ...params,
    fields: ['id', 'name', 'initial', 'final'],
  });
};

async function patchStatusCondition(condition) {
  await setItemProp({
    path: 'statusCondition',
    value: condition,
  });

  await setItemProp({
    path: 'status',
    value: status.value,
  });

  if (!isNew.value && !editMode.value) {
    await CasesAPI.patch({
      changes: {
        statusCondition: condition,
        status: status.value,
      },
      etag: itemInstance.value.etag,
    });

    //NOTE: needed to get new etag so new patch will work correctly
    await loadItem();
  }
}

async function handleSelect(value) {
  if (value.final) isResultPopup.value = true;

  await patchStatusCondition(value);
}

async function updateStatusCondition() {
  if (!status?.value?.id || itemInstance.value.statusCondition.id) return;

  const { items } = await StatusConditionsAPI.getList({
    statusId: status.value.id,
  });

  const initialCondition = items.find((item) => item.initial);
  if (initialCondition) {
    await patchStatusCondition(initialCondition);
  }
}

watch(() => status?.value?.id, updateStatusCondition, {
  immediate: true,
  deep: true,
});
</script>

<style lang="scss" scoped>
.case-status {
  width: 100%;

  &__title {
    display: block;
    @extend %typo-heading-4;
  }

  &__select,
  &__title {
    padding: var(--spacing-xs);
  }
}
</style>
