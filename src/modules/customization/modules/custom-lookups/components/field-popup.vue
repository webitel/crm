<template>
  <wt-popup
    :shown="shown"
    class="field-popup"
    overflow
    @close="close"
  >
    <template #header>
      {{ $t('customization.customLookups.addColumn') }}
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
          :label="$t('customization.customLookups.columns')"
          :value="value.id"
          :v="v$.value.id"
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
        {{ $t('reusable.add') }}
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
import { required } from '@vuelidate/validators';
import deepCopy from 'deep-copy';
import { computed, ref } from 'vue';

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

const value = ref(Object.assign(deepCopy(fieldInstant), deepCopy(props.field)));

const v$ = useVuelidate(
  computed(() => ({
    value: {
      name: { required },
      id: { required },
      kind: { required },
    },
  })),
  { value },
  { $autoDirty: true },
);

v$.value.$touch();

const disabledSave = computed(() => v$.value?.$invalid);

const save = () => {
  emit('save', deepCopy(value.value));
  close();

  if (!props.field) {
    Object.assign(value.value, fieldInstant);
  }
};

const close = () => {
  emit('close');
};
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
