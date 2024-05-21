<template>
  <wt-popup
    class="opened-contact-communication-popup"
    v-bind="attrs"
    size="sm"
    overflow
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
          :value="draft.type"
          :v="v$.draft.type"
          :search-method="(params) => CommunicationTypesAPI.getLookup({...params, channel: currentCommunication.filterField })"
          :clearable="false"
          :label="t('objects.communicationType', 1)"
          required
          @input="draft.type = $event"
        />
        <wt-input
          v-model="draft.destination"
          :v="v$.draft.destination"
          :clearable="false"
          :label="t('contacts.communications.destination')"
          required
        />
      </form>
    </template>
    <template #actions>
        <wt-button
          :disabled="v$.$invalid"
          :loading="isLoading"
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
import { computed, onMounted, ref, watch, reactive, useAttrs } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import CommunicationTypesAPI from '../api/CommunicationTypesAPI';
import { EngineCommunicationChannels } from 'webitel-sdk';

const { t } = useI18n();
const store = useStore();

const props = defineProps({
  item: {
    // if item is passed, that's an edit
    type: [Object, null],
  },
  channel: {
    type: String,
    default: 'number',
  },
  namespace: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

const attrs = useAttrs();

const isLoading = ref(false);
const isSaving = ref(false);
const TypeSelect = ref(null);

const communicationOptions = [
  {
    value: 'email', // should be same as backend field for destination
    addText: t('contacts.communications.emails.addTitle'),
    updateText: t('contacts.communications.emails.editTitle'),
    filterField: EngineCommunicationChannels.Email,
    addNamespace: `${props.namespace}/ADD_EMAIL`,
    updateNamespace: `${props.namespace}/UPDATE_EMAIL`,
  },
  {
    value: 'number',
    addText: t('contacts.communications.phones.addTitle'),
    updateText: t('contacts.communications.phones.editTitle'),
    filterField: EngineCommunicationChannels.Phone,
    addNamespace: `${props.namespace}/ADD_PHONE`,
    updateNamespace: `${props.namespace}/UPDATE_PHONE`,
  },
];

const getDefaultDraft = () => ({
  channel: props.channel,
  type: {},
  destination: '',
});

const draft = reactive(getDefaultDraft());

const currentCommunication = computed(() => {
  return communicationOptions.find((option) => option.value === props.channel);
});

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

function initDraft() {
  draft.destination = props.item[props.channel];
  draft.type = props.item.type;
}

v$.value.$touch();

if (props.item) initDraft();

async function save() {

  try {
    isSaving.value = true;
    if (props.item) {
      await updateItem(draft);
    } else {
      await addItem(draft);
    }
    close();
  } finally {
    isSaving.value = false;
  }
}

function addItem({ type, destination }) {
  const itemInstance = { type, [props.channel]: destination };
  return store.dispatch(`${currentCommunication.value.addNamespace}`, { itemInstance });
}

function updateItem({ channel, destination, ...rest }) {
  const itemInstance = { ...rest, [props.channel]: destination };
  return store.dispatch(`${currentCommunication.value.updateNamespace}`, {
    itemInstance,
    etag: props.item.etag,
  });
}

function close() {
  emit('close');
}

</script>

<style lang="scss" scoped>
.opened-contact-communication-popup-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
