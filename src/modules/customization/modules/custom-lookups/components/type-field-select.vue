<template>
  <wt-select
    :value="value.kind"
    :options="options"
    :label="$t('vocabulary.type')"
    :v="v$.value.kind"
    :disabled="disabled"
    required
    track-by="name"
    use-value-from-options-by-prop="type"
    @input="changeType"
  />
  <wt-select
    v-if="
      value.kind === FieldType.Select || value.kind === FieldType.Multiselect
    "
    :value="value.lookup"
    required
    :disabled="disabled"
    :label="$t('reusable.object')"
    :search-method="loadLookupList"
    :v="v$.value.lookup"
    track-by="name"
    :clearable="false"
    @input="selectObject($event)"
  >
    <template #option="{ option }">
      {{ getOptionLocale(option) }}
    </template>
    <template #singleLabel="{ option }">
      {{ getOptionLocale(option) }}
    </template>
  </wt-select>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { snakeToCamel } from '@webitel/ui-sdk/scripts';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import ObjectsApi from '../api/objects';
import { FieldType } from '../enums/FieldType.enum';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const { t, te } = useI18n();

const v$ = useVuelidate(
  computed(() => ({
    value: {
      kind: { required },
      lookup: {
        required: (value) => {
          if (
            props.value.kind === FieldType.Select ||
            props.value.kind === FieldType.Multiselect
          ) {
            return value;
          }

          return true;
        },
      },
    },
  })),
  { value: props.value },
  { $autoDirty: true },
);

v$.value.$touch();

const options = [
  {
    name: t(`customization.customLookups.fieldType.${FieldType.Text}`),
    type: FieldType.Text,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.Number}`),
    type: FieldType.Number,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.Select}`),
    type: FieldType.Select,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.Multiselect}`),
    type: FieldType.Multiselect,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.Calendar}`),
    type: FieldType.Calendar,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.Boolean}`),
    type: FieldType.Boolean,
  },
];

const changeType = (value) => {
  if (value === FieldType.Select || value === FieldType.Multiselect) {
    props.value.list = null;
    props.value.lookup = null;
  }
  props.value.kind = value;
};
const selectObject = (value) => {
  props.value.lookup = {
    path: value.path,
    name: value.name,
  };
};
const loadLookupList = (params) => {
  return ObjectsApi.getLookup(params);
};

const getOptionLocale = (option) => {
  if (!option) return '';

  const objectCode = snakeToCamel(option.repo || option.path);

  // From backend got repo with 's' at the end of the word which means plural, so need to remove it to get the singular form translation
  const singleObjectCode = objectCode.endsWith('s') ? objectCode.slice(0, -1) : objectCode;

  const hasTranslationInSameKeyByObject = te(`objects.${singleObjectCode}.${singleObjectCode}`);

  if (hasTranslationInSameKeyByObject) {
    return t(`objects.${singleObjectCode}.${singleObjectCode}`);
  }

  return te(`objects.${singleObjectCode}`) ? t(`objects.${singleObjectCode}`) : option.name;
};
</script>

<style scoped lang="scss"></style>
