<template>
  <wt-popup
    class="opened-contact-add-communication-popup"
    width="480"
    overflow
    @close="close"
  >
    <template v-slot:header>
      {{ mode === 'update' ? t('reusable.edit') : t('reusable.add') }}
      {{
        t('contacts.communications.communications', 1)
          .toLowerCase()
      }}
    </template>
    <template v-slot:main>
      <form
        class="opened-contact-add-communication-popup-form"
      >
        <wt-select
          :value="channel"
          :options="channelOptions"
          :disabled="mode === 'update'"
          :v="v$.draft.channel"
          :label="t('contacts.communications.channel')"
          :clearable="false"
          track-by="value"
          required
          @input="draft.channel = $event.value"
        ></wt-select>
        <wt-select
          ref="TypeSelect"
          :value="draft.type"
          :v="v$.draft.type"
          :search-method="(params) => CommunicationTypesAPI.getLookup({...params, channel: channel.filterField })"
          :clearable="false"
          :label="t('objects.communicationType', 1)"
          required
          @input="draft.type = $event"
        ></wt-select>
        <wt-input
          v-model="draft.destination"
          :v="v$.draft.destination"
          :clearable="false"
          :label="t('contacts.communications.destination')"
          required
        ></wt-input>
      </form>
    </template>
    <template v-slot:actions>
      <wt-button
        :disabled="v$.$invalid"
        :loading="isLoading"
        @click="save"
      >{{ t('reusable.save') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >{{ t('reusable.cancel') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
/*
Although this popup actually represents emails, phones or messaging item card,
I decided not to provide these modules with "card" store and features because
I think it would be too overcomplicated because these 3 modules have shared communications
popup (by UI design, "Add" button is higher on component hierarchy than entity table itself)
 */
import { computed, reactive, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { EngineCommunicationChannels } from 'webitel-sdk';
import CommunicationTypesAPI from '../api/CommunicationTypesAPI';

const props = defineProps({
  editedInstance: {
    type: Object,
  },
  callback: {
    type: Function,
    required: true,
  },
  // initialChannel: {
  //   type: String,
  //   default: 'number',
  // },
});

const emit = defineEmits([
  'close',
]);

const { t } = useI18n();

const channelOptions = [
  // {
  //   value: 'number', // should be same as backend field for destination
  //   locale: ['vocabulary.phones', 1],
  //   filterField: EngineCommunicationChannels.Phone,
  // },
  {
    value: 'email', // should be same as backend field for destination
    locale: ['vocabulary.emails', 1],
    filterField: EngineCommunicationChannels.Email,
  },
  // {
  //   value: 'messaging',
  //   locale: 'vocabulary.messaging',
  //   filterField: EngineCommunicationChannels.Messaging,
  // },
];

const getDefaultDraft = () => ({
  // channel: channelOptions.find(({ value }) => value === props.initialChannel).value,
  type: {},
  destination: '',
});

const draft = reactive(getDefaultDraft());
const isLoading = ref(false);
const TypeSelect = ref(null);

const v$ = useVuelidate(computed(() => {
  const destination = { required };
  if (draft.channel === 'email') destination.email = email;
  return {
    draft: {
      channel: { required },
      type: { required },
      destination,
    },
  };
}), { draft }, { $autoDirty: true });

v$.value.$touch();

const mode = computed(() => (props.editedInstance ? 'update' : 'create'));

const channel = computed(() => channelOptions.find(({ value }) => draft.channel === value));

function initDraft() {
  draft.channel = channelOptions.find(({ value }) => props.editedInstance[value]).value;
  draft.destination = props.editedInstance[draft.channel];
  draft.type = props.editedInstance.type;
}

if (mode.value === 'update') initDraft();

function close() {
  emit('close');
}

async function save() {
  try {
    isLoading.value = true;
    await props.callback(draft);
    close();
  } finally {
    isLoading.value = false;
  }
}

// watch(channel, () => {
//   draft.type = {}; // reset selected type, because it has another channel
//   TypeSelect.value.fetchOptions(); // load types by newly changed channel filter
// });
</script>

<style lang="scss" scoped>
.opened-contact-add-communication-popup-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
