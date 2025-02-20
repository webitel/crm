<template>
  <wt-select
    :value="value.kind"
    :options="options"
    :label="$t('vocabulary.type')"
    :v="v$.value.kind"
    required
    track-by="name"
    use-value-from-options-by-prop="type"
    @input="changeType"
  />
  <wt-select
    v-if="
      value.kind === FieldType.SELECT || value.kind === FieldType.MULTISELECT
    "
    :value="value.lookup"
    required
    :label="$t('reusable.object')"
    :search-method="loadLookupList"
    :v="v$.value.lookup"
    track-by="name"
    :clearable="false"
    @input="selectObject($event)"
  />
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import CustomLookupsApi from '../api/custom-lookups';
import FieldType from '../enums/FieldType.enum';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

const v$ = useVuelidate(
  computed(() => ({
    value: {
      kind: { required },
      lookup: {
        required: (value) => {
          if (
            props.value.kind === FieldType.SELECT ||
            props.value.kind === FieldType.MULTISELECT
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
    name: t(`customization.customLookups.fieldType.${FieldType.TEXT}`),
    type: FieldType.TEXT,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.NUMBER}`),
    type: FieldType.NUMBER,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.SELECT}`),
    type: FieldType.SELECT,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.MULTISELECT}`),
    type: FieldType.MULTISELECT,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.CALENDAR}`),
    type: FieldType.CALENDAR,
  },
  {
    name: t(`customization.customLookups.fieldType.${FieldType.BOOLEAN}`),
    type: FieldType.BOOLEAN,
  },
];

const changeType = (value) => {
  if (value === FieldType.SELECT || value === FieldType.MULTISELECT) {
    props.value.list = null;
    props.value.lookup = null;
  }
  props.value.kind = value;
};
const selectObject = (value) => {
  props.value.lookup = {
    type: value.path,
    name: value.name,
  };
};
const loadLookupList = (params) => {
  return CustomLookupsApi.getLookup(params);
};
</script>

<style scoped lang="scss"></style>
