<template>
  <wt-popup
    class="opened-contact-add-communication-popup"
    width="480"
    overflow
    @close="close"
  >
    <template #header>
      {{ item ? t('reusable.edit') : t('reusable.add') }}
      {{ props.label.toLowerCase() ||
        t('contacts.communications.communications', 1).toLowerCase()
      }}
    </template>
    <template #main>
      <form
        class="opened-contact-communication-popup-form"
      >
        <wt-select
          ref="TypeSelect"
          :value="draft.type"
          :v="v$.draft.type.model"
          :search-method="(params) => CommunicationTypesAPI.getLookup({...params, channel: props.filterField })"
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
import { computed, onMounted, ref, watch, reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import CommunicationTypesAPI from '../api/CommunicationTypesAPI';

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
  filterField: {
    type: String,
    required: true,
  },
  label: {
    type: String,
  },
});

const emit = defineEmits(['save', 'update', 'close']);


const getDefaultDraft = () => ({
  channel: props.channel,
  type: {},
  destination: '',
});


const isLoading = ref(false);
const isSaving = ref(false);
const TypeSelect = ref(null);

const draft = computed(() => {
  const initDraft = props.item ?
    {
      channel: props.item.channel ,
      type: props.item.type,
      destination: props.item[props.channel],
    }
    :  getDefaultDraft();
  return reactive(initDraft);
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

v$.value.$touch();

console.log('useVuelidate', 'v$.value:', v$.value);

async function save() {
  try {
    isSaving.value = true;
    if (props.item) {
      console.log('update draft.value:', draft.value);
      emit('update', draft.value);
      // updateItem(draft.value);
    } else {
      console.log('save draft.value:', draft.value);
      emit('save', draft.value);
      // addItem(draft.value);
    }
    // emit('saved', draft.value.id || newCommunication.id); //залишити, бо це сигнал, що було збережено і повертається айдішка
    close();
  } finally {
    isSaving.value = false;
  }
}

// function addItem({ type, destination }) {
//   //сформулювати данні з драфту
//   const itemInstance = { type, [props.channel]: destination };
//   return store.dispatch(`${namespace}/ADD_${props.filterField.toUpperCase()}`, { itemInstance });
// }
//
// function updateItem({ channel, destination, ...rest }) {
//   //сформулювати данні з драфту
//   const itemInstance = { ...rest, [props.channel]: destination };
//   return store.dispatch(`${namespace}/UPDATE_${props.filterField.toUpperCase()}`, {
//     itemInstance,
//     etag: item.value.etag,
//   });
// }

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
