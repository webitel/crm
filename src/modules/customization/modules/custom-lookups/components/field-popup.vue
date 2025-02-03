<template>
  <wt-popup
    :shown="shown"
    class="field-popup"
    overflow
    @close="close"
  >
    <template #header>
      {{
        field
          ? $t('customization.customLookups.editColumn')
          : $t('customization.customLookups.addColumn')
      }}
    </template>
    <template #main>
      <div class="field-popup-wrapper">
        <wt-input
          :label="$t('reusable.title')"
          :value="value.name"
          :v="v$.value.name"
          required
          @input="value.name = $event"
        />

        <wt-input
          :label="t('customization.customLookups.code')"
          :value="value.id"
          :v="v$.value.id"
          :custom-validators="[
            {
              name: 'checkId',
              text: $t('validation.latinWithNumber'),
            },
          ]"
          required
          @input="value.id = $event"
        />

        <type-field-select :value="value" />

        <wt-switcher
          :value="value.required"
          :label="$t('reusable.required')"
          @change="value.required = $event"
        ></wt-switcher>
      </div>
    </template>
    <template #actions>
      <wt-button
        :disabled="disabledSave"
        @click="save"
      >
        {{ field ? $t('reusable.save') : $t('reusable.add') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ $t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { helpers, required } from '@vuelidate/validators';
import deepCopy from 'deep-copy';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import TypeFieldSelect from './type-field-select.vue';

const fieldInstant = {
  name: '',
  id: '',
  kind: '',
  required: false,
  lookup: null,
  list: null,
};

const props = defineProps({
  field: {
    type: Object,
    default: () => null,
  },
  shown: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['save', 'close']);

const { t } = useI18n();

const checkId = (repo) => {
  const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return regex.test(repo);
};

const value = ref(Object.assign(deepCopy(fieldInstant), deepCopy(props.field)));

const v$ = useVuelidate(
  computed(() => ({
    value: {
      name: { required },
      id: {
        required,
        checkId: helpers.withMessage(t('validation.latinWithNumber'), checkId),
      },
      kind: { required },
    },
  })),
  { value },
  { $autoDirty: true },
);

v$.value.$touch();

const disabledSave = computed(() => v$.value?.$invalid);

const save = () => {
  const savedFiled = deepCopy(value.value);

  Object.keys(savedFiled).forEach((key) => {
    if (!savedFiled[key]) {
      delete savedFiled[key];
    }
  });

  emit('save', savedFiled);
  close();

  if (!props.field) {
    Object.assign(value.value, fieldInstant);
  }
};

const close = () => {
  emit('close');
};

watch(
  () => props.field,
  () => {
    if (props.field) {
      Object.assign(value.value, deepCopy(props.field));
    }
  },
  {
    deep: true,
  },
);

watch(
  () => props.shown,
  (shown) => {
    if (!shown && props.field) {
      Object.assign(value.value, deepCopy(props.field));
    }
  },
);
</script>

<style lang="scss" scoped>
.field-popup {
  &-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
