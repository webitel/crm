<template>
  <wt-popup
    width="480"
    overflow
    @close="close"
  >
    <template v-slot:header>
      {{ mode === 'update' ? t('reusable.edit') : t('reusable.add') }}
      {{ t('vocabulary.variables', 1).toLowerCase() }}
    </template>
    <template v-slot:main>
      <form>
        <wt-input
          v-model="draft.key"
          :v="v$.draft.key"
          :clearable="false"
          :label="t('vocabulary.keys',1)"
          required
        ></wt-input>
        <wt-input
          v-model="draft.value"
          :v="v$.draft.value"
          :clearable="false"
          :label="t('vocabulary.values',1)"
          required
        ></wt-input>
      </form>
    </template>
    <template v-slot:actions>
      <wt-button
        :loading="isLoading"
        :disabled="v$.invalid"
        @click="props.callback(draft)"
      >{{ mode === 'update' ? t('reusable.edit') : t('reusable.add') }}
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
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const props = defineProps({
  editedInstance: {
    type: Object,
  },
  callback: {
    type: Function,
  },
});

const emit = defineEmits(['close']);

const getDefaultDraft = () => ({
  id: '',
  etag: '',
  key: '',
  value: '',
});

const { t } = useI18n();

const isLoading = ref(false);
let draft = reactive(getDefaultDraft());

const v$ = useVuelidate(computed(() => ({
  draft: {
    key: { required },
    value: { required },
  },
})), { draft }, { $autoDirty: true });

v$.value.$touch();

const mode = computed(() => (props.editedInstance ? 'update' : 'create'));

if (mode.value === 'update') draft = Object.assign(draft, props.editedInstance);

function close() {
  emit('close');
}
</script>
