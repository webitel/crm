<template>
  <wt-popup
    :shown="shown"
    size="sm"
    overflow
    @close="close"
  >
    <template #header>
      {{ mode === 'update' ? t('reusable.edit') : t('reusable.add') }}
      {{ t('contacts.attributes', 1).toLowerCase() }}
    </template>
    <template #main>
      <form>
        <wt-input
          v-model="draft.key"
          :v="v$.draft.key"
          :clearable="false"
          :label="t('vocabulary.keys',1)"
          required
        />
        <wt-input
          v-model="draft.value"
          :v="v$.draft.value"
          :clearable="false"
          :label="t('vocabulary.values',1)"
          required
        />
      </form>
    </template>
    <template #actions>
      <wt-button
        :loading="isSaving"
        :disabled="v$.$invalid"
        @click="save"
      >
        {{ mode === 'update' ? t('reusable.edit') : t('reusable.add') }}
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
import { computed, reactive, ref, useAttrs, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

const route = useRoute();
const store = useStore();
const { t } = useI18n();

// animate popup appearance after f5 with popup opened
const shown = ref(false);
const isSaving = ref(false);

const getDefaultDraft = () => ({
  id: '',
  etag: '',
  key: '',
  value: '',
});

const draft = reactive(getDefaultDraft());

const v$ = useVuelidate(computed(() => ({
  draft: {
    key: { required },
    value: { required },
  },
})), { draft }, { $autoDirty: true });

v$.value.$touch();

const variableId = computed(() => route.params.variableId);

const mode = computed(() => (variableId.value === 'new' ? 'create' : 'update' ));

function close() {
  emit('close');
}

function getItem() {
  return store.dispatch(`${props.namespace}/GET_VARIABLE`, {
    id: variableId.value,
  });
}

function addItem(payload) {
  return store.dispatch(`${props.namespace}/ADD_VARIABLE`, {
    itemInstance: payload,
  });
}

function updateItem(payload) {
  return store.dispatch(`${props.namespace}/UPDATE_VARIABLE`, {
    itemInstance: payload,
    etag: payload.etag,
  });
}

async function save() {
  isSaving.value = true;
  if (variableId.value !== 'new') {
    await updateItem(draft);
  } else {
    await addItem(draft);
  }

  isSaving.value = false;

  setTimeout(() => {
    close();
  }, 1500);
}

watch(variableId, async () => {
  if (variableId.value === 'new') {
    Object.assign(draft, getDefaultDraft());
  } else if (variableId.value) {
    Object.assign(draft, await getItem());
  }
}, { immediate: true });

watch(variableId, () => {
  if (variableId.value) {
    setTimeout(() => shown.value = !!variableId.value, 300);
  } else {
    shown.value = !!variableId.value;
  }
}, { immediate: true });
</script>
