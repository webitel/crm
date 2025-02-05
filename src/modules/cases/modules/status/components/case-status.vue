<template>
  <case-result-popup
    :namespace="props.namespace"
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
import {computed, inject, ref, watch} from 'vue';
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

const editMode = inject('editMode');

const isResultPopup = ref(false);

async function saveResult({
  reason,
  result,
}) {
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
  if (option?.final) return 'final-status';
  if (option?.initial) return 'initial-status';
  return 'other-status';
}

const status = computed(() => store.getters[`${props.namespace}/service/STATUS`]);

const fetchStatusConditions = async (params) => {
  if (!status?.value?.id) {
    return { items: [] };
  }

  try {
    return await StatusConditionsAPI.getLookup({
      statusId: status.value.id,
      ...params,
      fields: ['id', 'name', 'initial', 'final'],
    });
  } catch (err) {
    throw err;
  }
};

async function patchStatusCondition(condition) {
  try {
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
  } catch (err) {
    throw err;
  }
}

async function handleSelect(value) {
  if (value.final) isResultPopup.value = true;

  try {
    await patchStatusCondition(value);
  } catch (err) {
    throw err;
  }
}

async function updateStatusCondition() {
  if (!status?.value?.id || itemInstance.value.statusCondition.id) return;

  try {
    const { items } = await StatusConditionsAPI.getList({ statusId: status.value.id });

    const initialCondition = items.find((item) => item.initial);
    if (initialCondition) {
      await patchStatusCondition(initialCondition);
    }
  } catch (err) {
    throw err;
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

  &__select, &__title {
    padding: var(--spacing-xs);
  }
}
</style>
