<template>
  <wt-popup
    :shown="!!conditionId"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ !isNew ? t('lookups.slas.editCondition') : t('lookups.slas.addCondition') }}
    </template>
    <template #main>
      <form>
        <wt-input
          :value="itemInstance.name"
          :label="t('reusable.name')"
          required
          @input="setItemProp({ path: 'name', value: $event })"
        />
        <wt-select
          :value="itemInstance.priorities"
          :label="t('vocabulary.priority')"
          :search-method="PrioritiesAPI.getLookup"
          multiple
          required
          @input="setItemProp({ path: 'priorities', value: $event })"
        />
        <wt-timepicker
          :label="t('lookups.slas.reactionTime')"
          :value="itemInstance.reactionTime"
          format="hh:mm"
          required
          @input="setItemProp({ path: 'reactionTime', value: $event })"
        />

        <wt-timepicker
          :label="t('lookups.slas.resolutionTime')"
          :value="itemInstance.resolutionTime"
          format="hh:mm"
          required
          @input="setItemProp({ path: 'resolutionTime', value: $event })"
        />
      </form>
    </template>
    <template #actions>
      <wt-button
        @click="save">
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
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useCardStore } from '@webitel/ui-sdk/store';
import PrioritiesAPI from '../../../../ priorities/api/priorities.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['load-data']);

const route = useRoute();
const router = useRouter();
const { t } = useI18n();

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

const { close } = useClose(`${CrmSections.SLAS}-conditions`);

function loadDataList() {
  emit('load-data');
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
