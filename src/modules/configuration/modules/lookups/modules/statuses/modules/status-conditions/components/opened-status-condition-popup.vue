<template>
  <wt-popup
    class="opened-status-condition-popup"
    :shown="!!statusConditionId"
    size="sm"
    overflow
    @close="close"
  >
    <template #title>
      {{
        !isNew
          ? t('lookups.statuses.editStatus')
          : t('lookups.statuses.addStatus')
      }}
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

        <wt-textarea
          :label="t('vocabulary.description')"
          :model-value="itemInstance.description"
          :disabled="disableUserInput"
          @update:model-value="setItemProp({ path: 'description', value: $event })"
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
import { required } from '@vuelidate/validators';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
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

const { disableUserInput, hasSaveActionAccess } =
  useUserAccessControl({
    useUpdateAccessAsAllMutableChecksSource: true,
  });

const {
  itemInstance,
  resetState,
  addItem,
  loadItem,
  updateItem,
  setId,
  setItemProp,
  id,
} = useCardStore(props.namespace);

const statusConditionId = computed(() => route.params.statusConditionId);
const isNew = computed(() => statusConditionId.value === 'new');

const v$ = useVuelidate(
  computed(() => ({
    itemInstance: {
      name: { required },
    },
  })),
  { itemInstance },
  { $autoDirty: true, $stopPropagation: true },
);

v$.value.$touch();

const { close } = useClose(`status-conditions`);
const disabledSave = computed(
  () => v$.value?.$invalid || !itemInstance.value._dirty,
);

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
      await setId(statusConditionId.value);
      await loadItem();
    }
  } catch (error) {
    throw Error(error);
  }
}

watch(
  () => statusConditionId.value,
  (value) => {
    if (value) {
      initializePopup();
    } else {
      resetState();
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped></style>
