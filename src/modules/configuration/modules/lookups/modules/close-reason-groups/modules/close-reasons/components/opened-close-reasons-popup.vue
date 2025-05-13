<template>
  <wt-popup
    :shown="!!closeReasonsId"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ !isNew ? t('lookups.closeReasonGroups.editReason') : t('lookups.closeReasonGroups.addReason') }}
    </template>
    <template #main>
      <form>
        <wt-input
          :label="t('reusable.name')"
          :value="itemInstance.name"
          :v="v$.itemInstance.name"
          :disabled="disableUserInput"
          required
          @input="setItemProp({ path: 'name', value: $event })"
        />

        <wt-textarea
          :disabled="disableUserInput"
          :label="t('vocabulary.description')"
          :value="itemInstance.description"
          @input="setItemProp({ path: 'description', value: $event })"
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

const closeReasonsId = computed(() => route.params.closeReasonsId);
const isNew = computed(() => closeReasonsId.value === 'new');

const v$ = useVuelidate(computed(() => ({
  itemInstance: {
    name: { required },
  },
})), { itemInstance }, { $autoDirty: true, $stopPropagation: true });

v$.value.$touch();

const { close } = useClose(`close-reasons`);

const disabledSave = computed(() => v$.value?.$invalid || !itemInstance.value._dirty);

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
      await setId(closeReasonsId.value);
      await loadItem();
    }
  } catch (error) {
    throw error;
  }
}

watch(() => closeReasonsId.value, (value) => {
  if (value) {
    initializePopup();
  } else {
    resetState();
  }
}, { immediate: true });

</script>

<style lang="scss" scoped>
</style>
