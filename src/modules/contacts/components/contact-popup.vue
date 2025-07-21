<template>
  <wt-popup
    class="contact-popup"
    :shown="shown"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ props.id ? t('reusable.edit') : t('reusable.new') }}
      {{ t('contacts.contact', 1).toLowerCase() }}
    </template>

    <template #main>
      <form class="contact-popup-form">
        <wt-input
          :value="draft.name"
          :label="t('reusable.name')"
          :v="v$.draft.name"
          required
          prevent-trim
          @input="draft.name = $event"
        />

        <wt-select
          :value="draft.groups"
          :label="t('cases.groupPerformers')"
          :search-method="loadStaticContactGroupsList"
          multiple
          @input="draft.groups = $event"
        />

        <wt-select
          :value="draft.timezones[0]?.timezone"
          :label="t('date.timezone', 1)"
          :search-method="CalendarsAPI.getTimezonesLookup()"
          @input="draft.timezones[0] = { timezone: $event }"
        />

        <wt-select
          :value="draft.managers[0]?.user"
          :label="t('contacts.manager', 1)"
          :search-method="UsersAPI.getLookup"
          @input="draft.managers[0] = { user: $event }"
        />

        <wt-tags-input
          :value="draft.labels"
          :label="t('vocabulary.labels', 1)"
          :search-method="LabelsAPI.getList"
          option-label="label"
          track-by="label"
          taggable
          @input="draft.labels = $event"
        />

        <wt-textarea
          :value="draft.about"
          :label="t('vocabulary.description')"
          @input="draft.about = $event"
        />
      </form>
    </template>

    <template #actions>
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
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { CalendarsAPI, ContactGroupsAPI, ContactsAPI, LabelsAPI,UsersAPI } from '@webitel/api-services/api';
import { WebitelContactsGroupType } from '@webitel/api-services/gen/models';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const props = defineProps({
  id: {
    // if id is passed, that's an edit
    type: [String, null],
  },
  shown: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['saved', 'close']);

const { t } = useI18n();
const store = useStore();

const userinfo = computed(() => store.state.userinfo);

const generateNewDraft = () => ({
  name: '',
  timezones: [],
  managers: [],
  labels: [],
  groups: [],
  about: '',
  createdBy: '',
});

const draft = ref(generateNewDraft());

const v$ = useVuelidate(
  computed(() => ({
    draft: {
      name: { required },
    },
  })),
  { draft },
  { $autoDirty: true },
);

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
      await ContactsAPI.update({
        itemInstance: { ...draft.value, id: props.id },
      });
    } else {
      newContact = await ContactsAPI.add({
        itemInstance: {
          ...draft.value,
        },
      });
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

function loadStaticContactGroupsList(params) {
  return ContactGroupsAPI.getLookup({
    ...params,
    type: WebitelContactsGroupType.Static,
  });
}

watch(
  () => props.shown,
  (value) => {
    if (value) {
      if (props.id) loadItem(props.id);
      else {
        draft.value = generateNewDraft();
        setDefaultManager();
      }
    }
  },
);
</script>

<style lang="scss" scoped>
.contact-popup-form {
  display: flex;
  flex-direction: column;
  grid-row-gap: var(--spacing-sm);

  :deep(.multiselect__content-wrapper) {
    max-height: 240px !important; // override default vue-multiselect styles, applied as attribute
  }
}
</style>
