<template>
  <case-result-popup
    :namespace="namespace"
    :shown="isResultPopup"
    @close="onPopupClose"
    @save="saveResult"
    @update:show="isResultPopup = $event"
  />
  <div class="case-status">
    <span class="case-status__title">{{ t('cases.status') }}</span>

    <div>
      <!-- NOTE: key is used to force re-render the select component if statusId changed so search-method updates with new statusId -->
      <wt-select
        :key="status?.id"
        :disabled="disableUserInput"
        :v="v$.value.itemInstance.statusCondition"
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

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import CasesAPI from '../../../api/CasesAPI.js';
import StatusConditionsAPI from '../api/StatusConditionsAPI.js';
import CaseResultPopup from './case-result-popup.vue';

const namespace = inject('namespace');
const editMode = inject('editMode');
const v$ = inject('v$');

const { t } = useI18n();
const store = useStore();

const { disableUserInput } = useUserAccessControl();

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
const prevStatusCondition = ref(itemInstance.value.statusCondition);

const saveResult = async ({ reason, result }) => {
  await setItemProp({
    path: 'close.closeReason',
    value: reason,
  });
  await setItemProp({
    path: 'close.closeResult',
    value: result,
  });

  if (!editMode.value) {
    await patchStatusCondition(itemInstance.value.statusCondition);

    await CasesAPI.patch({
      changes: {
        close: {
          closeReason: reason,
          closeResult: result,
        },
      },
      etag: itemInstance.value.etag,
    });

    //NOTE: needed to get new etag so new patch will work correctly
    await loadItem();
  }
};

const onPopupClose = () => {
  isResultPopup.value = false;

  if (!editMode.value) {
    itemInstance.value.statusCondition = prevStatusCondition.value;
  }
};

const getIndicatorColor = (option) => {
  if (option?.final) return 'final-status';
  if (option?.initial) return 'initial-status';
  return 'other-status';
};

const status = computed(() => store.getters[`${cardNamespace}/service/STATUS`]);

const serviceId = computed(
  () => store.getters[`${cardNamespace}/service/SERVICE_ID`],
);

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
  if (value.final && !editMode.value) {
    itemInstance.value.statusCondition = value;
    isResultPopup.value = true;
    return;
  }

  if (value.final) {
    isResultPopup.value = true;
  }

  await patchStatusCondition(value);
  prevStatusCondition.value = value;
}

async function updateStatusCondition(isValidationRequired = true) {
  if (!status?.value?.id) {
    return;
  }

  if (isValidationRequired && itemInstance.value.statusCondition.id) return;

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

watch(
  () => serviceId?.value,
  (newValue, oldValue) => {
    if (newValue === oldValue) return;
    updateStatusCondition(false);
  },
);
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

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
