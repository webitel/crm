<template>
  <wt-popup
    class="contact-popup"
    width="480"
    @close="close"
  >
    <template v-slot:title>
      {{ t('reusable.new') }}
      {{ t('crm.contacts.contacts', 1) }}
    </template>
    <template v-slot:main>
      <form class="contact-popup-form">
        <wt-input
          :value="itemInstance.name.commonName"
          :label="t('reusable.name')"
          :v="v$.itemInstance.name.commonName"
          required
          @input="setItemProp({ path: 'name.commonName', value: $event })"
        ></wt-input>
        <wt-select
          :value="itemInstance.timezones"
          :label="t('date.timezone', 1)"
          :search-method="() => ({ items: [] })"
          @input="setItemProp({ path: 'timezones', value: $event })"
        ></wt-select>
        <wt-select
          :value="itemInstance.managers"
          :label="t('contacts.manager', 1)"
          :search-method="() => ({ items: [] })"
          @input="setItemProp({ path: 'managers', value: $event })"
        ></wt-select>
        <wt-tags-input
          :value="itemInstance.labels"
          :label="t('vocabulary.labels', 1)"
          :search-method="LabelsAPI.getList"
          taggable
          @input="setItemProp({ path: 'labels', value: $event })"
        ></wt-tags-input>
        <wt-textarea
          :value="itemInstance.about"
          :label="t('vocabulary.description')"
          @input="setItemProp({ path: 'about', value: $event })"
        ></wt-textarea>
      </form>
    </template>
    <template v-slot:actions>
      <wt-button
        :disabled="v$.$invalid"
        :loading="isSaving"
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
import { computed, ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';
import LabelsAPI from '../api/LabelsAPI';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  id: {
    // if id is passed, that's an edit
    type: [String, null],
  },
});
const emit = defineEmits(['saved', 'close']);

const { t } = useI18n();
const {
  namespace,
  itemInstance,

  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
  setItemProp,
} = useCardStore(props.namespace);

const v$ = useVuelidate(computed(() => ({
  itemInstance: {
    name: {
      commonName: { required },
    },
  },
})), { itemInstance }, { $autoDirty: true });

v$.value.$touch();

const isSaving = ref(false);

async function close() {
  await resetState();
  emit('close');
}

async function save() {
  try {
    isSaving.value = false;
    if (props.id) {
      await updateItem();
    } else {
      await addItem();
    }
    emit('saved');
    close();
  } finally {
    isSaving.value = false;
  }
}

async function initializeEdit() {
  await setId(props.id);
  await loadItem();
}

if (props.id) initializeEdit();
</script>

<style lang="scss" scoped>
.contact-popup-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  :deep(.multiselect__content-wrapper) {
    max-height: 240px !important; // override default vue-multiselect styles, applied as attribute
  }
}
</style>
