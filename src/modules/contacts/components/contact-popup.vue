<template>
  <wt-popup
    class="contact-popup"
    width="480"
    @close="close"
  >
    <template v-slot:title>
      {{ props.id ? t('reusable.edit') : t('reusable.new') }}
      {{ t('contacts.contact', 1).toLowerCase() }}
    </template>
    <template v-slot:main>
      <form class="contact-popup-form">
        <wt-input
          :value="draft.name.commonName"
          :label="t('reusable.name')"
          :v="v$.draft.name.commonName"
          required
          prevent-trim
          @input="draft.name.commonName = $event"
        ></wt-input>
        <wt-select
          :value="draft.timezones"
          :label="t('date.timezone', 1)"
          :search-method="TimezonesAPI.getList"
          @input="draft.timezones = $event"
        ></wt-select>
        <wt-select
          :value="draft.managers[0]?.user"
          :label="t('contacts.manager', 1)"
          :search-method="UsersAPI.getLookup"
          @input="draft.managers[0] = { user: $event }"
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
import { computed, onMounted, ref, watch } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
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
const store = useStore();

const userinfo = computed(() => store.state.userinfo);

const draft = ref({
  name: {
    commonName: '',
  },
  timezones: [],
  managers: [],
  labels: [],
  about: '',
  createdBy: '',
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
  let newContact = '';
  try {
    isSaving.value = false;
    if (props.id) {
      await ContactsAPI.update({ itemInstance: { ...draft.value, id: props.id } });
    } else {
      newContact = await ContactsAPI.add({ itemInstance: draft.value });
    }
    emit('saved', props.id || newContact.id);
    close();
  } finally {
    isSaving.value = false;
  }
}

function setDefaultManager() {
  draft.value.managers[0] = {
    user: {
      id: userinfo.value.userId,
      name: userinfo.value.name,
    },
  };
}

async function loadItem(id = props.id) {
  draft.value = await ContactsAPI.get({ itemId: id });
}

if (props.id) loadItem(props.id);
else setDefaultManager();
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
