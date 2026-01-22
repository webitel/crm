<template>
  <case-result-popup
    :namespace="namespace"
    :shown="isResultPopup"
    @save="confirmChangingStatusToFinal"
    @cancel="cancelChangingStatusToFinal"
  />
  <div class="case-status">
    <span class="case-status__title typo-heading-4">{{ t('cases.status') }}</span>

    <div>
      <!-- NOTE: key is used to force re-render the select component if statusId changed so search-method updates with new statusId -->
      <wt-select
        :key="status?.id"
        :disabled="disableStatusSelect"
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
import { CaseStatusConditionsAPI } from '@webitel/api-services/api';
import { isEmpty } from '@webitel/ui-sdk/scripts';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import CasesAPI from '../../../api/CasesAPI.js';
import CaseResultPopup from './case-result-popup.vue';

const namespace = inject('namespace');
const editMode = inject('editMode');
const isReadOnly = inject('isReadOnly');
const v$ = inject('v$');

const { t } = useI18n();
const store = useStore();

const { disableUserInput } = useUserAccessControl();

const disableStatusSelect = computed(() => disableUserInput.value || isReadOnly)

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

const openCaseResultPopup = () => {
  isResultPopup.value = true;
};

const closeCaseResultPopup = () => {
  isResultPopup.value = false;
};

const startChangingStatusToFinal = (statusCondition) => {
  itemInstance.value.statusCondition = statusCondition;
  openCaseResultPopup();
};

const confirmChangingStatusToFinal = async ({ reason, result }) => {
  await setItemProp({
    path: 'closeReason',
    value: reason,
  });
  await setItemProp({
    path: 'closeResult',
    value: result,
  });

  if (!editMode.value) {
    await patchStatusCondition(itemInstance.value.statusCondition);

    await CasesAPI.patch({
      changes: {
        closeReason: reason,
        closeResult: result,
      },
      etag: itemInstance.value.etag,
    });

    //NOTE: needed to get new etag so new patch will work correctly
    await loadItem();
  }

  closeCaseResultPopup();
};

const cancelChangingStatusToFinal = () => {
  closeCaseResultPopup();
  itemInstance.value.statusCondition = prevStatusCondition.value;
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

  return await CaseStatusConditionsAPI.getLookup({
    statusId: status.value.id,
    ...params,
    fields: ['id', 'name', 'initial', 'final'],
  });
};

async function patchStatusCondition(condition) {
  await updateLocalProperties(condition);

  if (!isNew.value && !editMode.value) {
    await patchRemoteChanges(condition);
    await loadItem();
  }
}

async function updateLocalProperties(condition) {
  await setItemProp({ path: 'statusCondition', value: condition });
  await setItemProp({ path: 'status', value: status.value });

  if (editMode.value && !condition.final) {
    await setItemProp({ path: 'closeReason', value: {} });
    await setItemProp({ path: 'closeResult', value: '' });
  }
}

async function patchRemoteChanges(condition) {
  const changes = {
    statusCondition: condition,
    status: status.value,
  };

  if (!condition.final) {
    changes.closeReason = {};
    changes.closeResult = '';
  }

  await CasesAPI.patch({
    changes,
    etag: itemInstance.value.etag,
  });
}

async function handleSelect(selectedStatusCondition) {
  if (selectedStatusCondition.final) {
    startChangingStatusToFinal(selectedStatusCondition);
  } else if /* at reset */(isEmpty(selectedStatusCondition)) {
    const { items } = await fetchStatusConditions();
    const initialStatusCondition = items.find(({ initial }) => initial);
    handleSelect(initialStatusCondition);
  } else {
    await patchStatusCondition(selectedStatusCondition);
    prevStatusCondition.value = selectedStatusCondition;
  }
}

async function updateStatusCondition(isValidationRequired = true) {
  if (!status?.value?.id) {
    return;
  }

  if (isValidationRequired && itemInstance.value.statusCondition.id) return;

  const { items } = await CaseStatusConditionsAPI.getList({
    statusId: status.value.id,
  });

  const initialCondition = items.find((item) => item.initial);
  if (initialCondition) {
    await patchStatusCondition(initialCondition);
  }
}

watch(
  () => status.value?.id,
  async (newStatusId, oldStatusId) => {
    if (!newStatusId || itemInstance.value.statusCondition.final) return;

    // NOTE: on initial mount (oldStatusId === undefined) we want to skip only if there’s already a stat usCondition.id, on any subsequent status‐change we force the reset
    const validationRequired = oldStatusId === undefined;

    await updateStatusCondition(validationRequired);
  },
  { immediate: true },
);
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-status {
  width: 100%;

  &__title {
    display: block;
  }

  &__select,
  &__title {
    padding: var(--spacing-xs);
  }
}
</style>
