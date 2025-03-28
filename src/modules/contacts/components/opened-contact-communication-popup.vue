<template>
  <wt-popup
    :shown="shown"
    class="opened-contact-communication-popup"
    overflow
    size="sm"
    @close="close"
  >
    <template #header>
      {{ item ? currentCommunication.updateText : currentCommunication.addText }}
    </template>
    <template #main>
      <form
        class="opened-contact-communication-popup-form"
      >
        <wt-select
          ref="TypeSelect"
          :clearable="false"
          :label="t('objects.communicationType', 1)"
          :search-method="(params) => CommunicationTypesAPI.getLookup({...params, channel: currentCommunication.filterField })"
          :v="v$.draft.type"
          :value="draft.type"
          required
          @input="draft.type = $event"
        />
        <wt-input
          v-model="draft.destination"
          :clearable="false"
          :label="t('contacts.communications.destination')"
          :v="v$.draft.destination"
          required
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
import { email, required } from '@vuelidate/validators';
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { EngineCommunicationChannels } from 'webitel-sdk';

import CommunicationTypesAPI from '../api/CommunicationTypesAPI';

const props = defineProps({
  channel: {
    type: String,
    required: true,
  },
  namespace: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

const { t } = useI18n();
const store = useStore();
const route = useRoute();

// animate popup appearance after f5 with popup opened
const shown = ref(false);

const isSaving = ref(false);
const TypeSelect = ref(null);

const communicationOptions = [
  {
    value: 'email', // should be same as backend field for destination
    addText: t('contacts.communications.emails.addTitle'),
    updateText: t('contacts.communications.emails.editTitle'),
    filterField: EngineCommunicationChannels.Email,
    getNamespace: `${props.namespace}/GET_EMAIL`,
    addNamespace: `${props.namespace}/ADD_EMAIL`,
    updateNamespace: `${props.namespace}/UPDATE_EMAIL`,
  },
  {
    value: 'number',
    addText: t('contacts.communications.phones.addTitle'),
    updateText: t('contacts.communications.phones.editTitle'),
    filterField: EngineCommunicationChannels.Phone,
    getNamespace: `${props.namespace}/GET_PHONE`,
    addNamespace: `${props.namespace}/ADD_PHONE`,
    updateNamespace: `${props.namespace}/UPDATE_PHONE`,
  },
];

const generateNewDraft = () => ({
  channel: props.channel,
  type: {},
  destination: '',
});

const draft = reactive(generateNewDraft());

const currentCommunication = computed(() => {
  return communicationOptions.find((option) => option.value === props.channel);
});

const commId = computed(() => route.params.commId);

const v$ = useVuelidate(computed(() => {
  const destination = props.channel === 'email' ? { required, email } : { required };
  return {
    draft: {
      channel: { required },
      type: { required },
      destination,
    },
  };
}), { draft }, { $autoDirty: true });

async function initDraft() {
  const comm = await getItem({ id: commId.value });
  Object.assign(draft, comm);
  draft.destination = comm[props.channel];
}

v$.value.$touch();

async function save() {
  isSaving.value = true;
  if (commId.value !== 'new') {
    await updateItem(draft);
  } else {
    await addItem(draft);
  }

  isSaving.value = false;

  setTimeout(() => {
    close();
  }, 1500);
}

function getItem() {
  return store.dispatch(`${currentCommunication.value.getNamespace}`, { id: commId.value });
}

function addItem({ type, destination }) {
  const itemInstance = { type, [props.channel]: destination };
  return store.dispatch(`${currentCommunication.value.addNamespace}`, { itemInstance });
}

function updateItem({ channel, destination, ...rest }) {
  const itemInstance = { ...rest, [props.channel]: destination };
  return store.dispatch(`${currentCommunication.value.updateNamespace}`, {
    itemInstance,
    etag: draft.etag,
  });
}

function close() {
  emit('close');
}

watch(commId, () => {
  if (commId.value === 'new') {
    Object.assign(draft, generateNewDraft());
  } else if (commId.value) {
    initDraft();
  }
}, { immediate: true });

watch(commId, () => {
  if (commId.value) {
    setTimeout(() => shown.value = !!commId.value, 300);
  } else {
    shown.value = !!commId.value;
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
.opened-contact-communication-popup-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
