<template>
  <wt-popup
    class="opened-sla-condition-popup"
    :shown="!!conditionId"
    size="sm"
    overflow
    @close="close"
  >
    <template #title>
      {{ !isNew ? t('lookups.slas.editCondition') : t('lookups.slas.addCondition') }}
    </template>
    <template #main>
      <form class="opened-card-input-grid opened-card-input-grid--1-col">
        <wt-input
          :value="itemInstance.name"
          :label="t('reusable.name')"
          :v="v$.itemInstance.name"
          :disabled="disableUserInput"
          required
          @input="setItemProp({ path: 'name', value: $event })"
        />
        <wt-select
          :value="itemInstance.priorities"
          :label="t('vocabulary.priority')"
          :search-method="id ? getConditionPriorities : getFreePriorities"
          :close-on-select="false"
          :disabled="disableUserInput"
          :v="v$.itemInstance.priorities"
          multiple
          required
          @input="setItemProp({ path: 'priorities', value: $event })"
        />
        <wt-timepicker
          :label="t('lookups.slas.reactionTime')"
          :value="itemInstance.reactionTime"
          :v="v$.itemInstance.reactionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @input="setItemProp({ path: 'reactionTime', value: +$event })"
        />

        <wt-timepicker
          :label="t('lookups.slas.resolutionTime')"
          :value="itemInstance.resolutionTime"
          :v="v$.itemInstance.resolutionTime"
          :disabled="disableUserInput"
          format="hh:mm"
          required
          @input="setItemProp({ path: 'resolutionTime', value: +$event })"
        />

      </form>
    </template>
    <template #actions>
      <wt-button
        :disabled="!hasSaveActionAccess || disabledSave"
        @click="save"
      >
        {{ t('reusable.save') }}
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
import { useVuelidate } from '@vuelidate/core';
import { minValue, required } from '@vuelidate/validators';
import { CasePrioritiesAPI } from '@webitel/api-services/api';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['load-data']);

const route = useRoute();
const { t } = useI18n();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl({
  useUpdateAccessAsAllMutableChecksSource: true,
});

const {
  namespace: cardNamespace,
  itemInstance,
  resetState,
  addItem,
  loadItem,
  updateItem,
  setId,
  setItemProp,
  id,
} = useCardStore(props.namespace);

const conditionId = computed(() => route.params.conditionId);
const isNew = computed(() => conditionId.value === 'new');

const v$ = useVuelidate(computed(() => ({
  itemInstance: {
    name: { required },
    priorities: { required },
    reactionTime: { required, minValue: minValue(1) },
    resolutionTime: { required, minValue: minValue(1) },
  },
})), { itemInstance }, { $autoDirty: true, $stopPropagation: true });

v$.value.$touch();

const { close } = useClose(`${CrmSections.SLAS}-conditions`);
const disabledSave = computed(() => v$.value?.$invalid || !itemInstance.value._dirty);

function loadDataList() {
  emit('load-data');
}

function getFreePriorities(params) {
  return CasePrioritiesAPI.getLookup({ ...params,notInSla: route.params.id });
}

function getConditionPriorities(params) {
  return CasePrioritiesAPI.getLookup({ ...params, inSlaCond: id.value });
}

const save = async () => {
  if (isNew.value) {
    await addItem({ itemInstance, parentId: id.value });
  } else {
    await updateItem({ itemInstance, itemId: id.value });
  }

  close();
  loadDataList();
};

async function initializePopup() {
  try {
    if (!isNew.value) {
      await setId(conditionId.value);
      await loadItem();
    }
  } catch (error) {
    throw error;
  }
}

watch(() => conditionId.value, (value) => {
  if (value) {
    initializePopup();
  } else {
    resetState();
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
</style>
