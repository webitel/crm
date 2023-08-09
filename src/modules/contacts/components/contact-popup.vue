<template>
  <wt-popup
    class="contact-popup"
    width="480"
    @close="close"
  >
    <template v-slot:title>
      {{ t('reusable.new') }}
      {{ t('contacts.contact', 1) }}
    </template>
    <template v-slot:main>
      <form class="contact-popup-form">
        <wt-input
          :value="draft.name.commonName"
          :label="t('reusable.name')"
          :v="v$.draft.name.commonName"
          required
          @input="draft.name.commonName = $event"
        ></wt-input>
        <wt-select
          :value="draft.timezones"
          :label="t('date.timezone', 1)"
          :search-method="TimezonesAPI.getList"
          @input="draft.timezones = $event"
        ></wt-select>
        <wt-select
          :value="draft.managers"
          :label="t('contacts.manager', 1)"
          :search-method="UsersAPI.getLookup"
          @input="draft.managers = $event"
        ></wt-select>
        <wt-tags-input
          :value="draft.labels"
          :label="t('vocabulary.labels', 1)"
          :search-method="LabelsAPI.getList"
          option-label="label"
          track-by="label"
          taggable
          @input="draft.labels = $event"
        ></wt-tags-input>
        <wt-textarea
          :value="draft.about"
          :label="t('vocabulary.description')"
          @input="draft.about = $event"
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
import LabelsAPI from '../api/LabelsAPI';
import TimezonesAPI from '../api/TimezonesAPI';
import UsersAPI from '../api/UsersAPI';
import ContactsAPI from '../api/ContactsAPI';

const props = defineProps({
  id: {
    // if id is passed, that's an edit
    type: [String, null],
  },
});
const emit = defineEmits(['saved', 'close']);

const { t } = useI18n();
const draft = ref({
  name: {
    commonName: '',
  },
  timezones: [],
  managers: [],
  labels: [],
  about: '',
});

const v$ = useVuelidate(computed(() => ({
  draft: {
    name: {
      commonName: { required },
    },
  },
})), { draft }, { $autoDirty: true });

v$.value.$touch();

const isSaving = ref(false);

function close() {
  emit('close');
}

async function save() {
  try {
    isSaving.value = false;
    if (props.id) {
      await ContactsAPI.update({ itemInstance: { ...draft.value, id: props.id } });
    } else {
      await ContactsAPI.add({ itemInstance: draft.value });
    }
    emit('saved');
    close();
  } finally {
    isSaving.value = false;
  }
}

async function loadItem(id = props.id) {
  draft.value = await ContactsAPI.get({ itemId: id });
}

if (props.id) loadItem(props.id);
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
