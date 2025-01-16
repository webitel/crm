<template>
  <wt-popup
    :shown="!!closeReasonsId"
    class="opened-close-reasons-popup"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ !isNew ? t('reusable.edit') : t('reusable.add') }}
      {{ t('lookups.closeReasonGroups.reason', 1).toLowerCase() }}
    </template>
    <template #main>
      <form class="opened-close-reasons-popup__wrapper">
        <wt-input
          :label="t('reusable.name')"
          :value="itemInstance.name"
          :v="v$.itemInstance.name"
          required
          @input="setItemProp({ path: 'name', value: $event })"
        />

        <wt-textarea
          :label="t('vocabulary.description')"
          :value="itemInstance.description"
          @input="setItemProp({ path: 'description', value: $event })"
        />
      </form>
    </template>
    <template #actions>
      <wt-button
        :disabled="disabledSave"
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
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['load-data']);

const route = useRoute();
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

const closeReasonsId = computed(() => route.params.closeReasonsId);
const isNew = computed(() => closeReasonsId.value === 'new');

const v$ = useVuelidate(computed(() => ({
  itemInstance: {
    name: { required },
  },
})), { itemInstance }, { $autoDirty: true });

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
