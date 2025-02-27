<template>
  <wt-input
    v-if="field.kind === FieldType.Text"
    :value="itemInstance[field.id]"
    :v="v$.itemInstance[field.id]"
    :label="t(field.name)"
    :required="field.required"
    @input="setItemProp({ path: field.id, value: $event })"
  />
  <wt-input
    v-else-if="field.kind === FieldType.Number"
    :value="itemInstance[field.id]"
    :v="v$.itemInstance[field.id]"
    :label="t(field.name)"
    type="number"
    :required="field.required"
    @input="setItemProp({ path: field.id, value: $event })"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.Boolean"
    :label="t(field.name)"
    :value="itemInstance[field.id]"
    :v="v$.itemInstance[field.id]"
    :required="field.required"
    @change="setItemProp({ path: field.id, value: $event })"
  />
  <wt-select
    v-else-if="field.kind === FieldType.Select"
    :label="t(field.name)"
    :value="itemInstance[field.id]"
    :v="v$.itemInstance[field.id]"
    :search-method="loadLookupList(field.lookup)"
    track-by="name"
    clearable
    :required="field.required"
    @input="selectElement"
  />
  <wt-select
    v-else-if="field.kind === FieldType.Multiselect"
    :label="t(field.name)"
    :value="itemInstance[field.id]"
    :v="v$.itemInstance[field.id]"
    :search-method="loadLookupList(field.lookup)"
    track-by="name"
    clearable
    multiple
    :required="field.required"
    @input="selectElements"
  />
  <wt-datepicker
    v-else-if="field.kind === FieldType.Calendar"
    :label="t(field.name)"
    :value="itemInstance[field.id] * convertedTime"
    mode="datetime"
    :required="field.required"
    @input="setItemProp({ path: field.id, value: +$event / convertedTime })"
  />
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { FieldType } from '../../../../../../customization/modules/custom-lookups/enums/FieldType.enum';
import CustomLookupApi from '../api/custom-lookups.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  field: {
    type: Object,
    required: true,
  },
});

const { itemInstance, setItemProp } = useCardStore(props.namespace);

const { t } = useI18n();

// Number for convert time from seconds to milliseconds, when send to backend and display on frontend
const convertedTime = 1000;

const v$ = useVuelidate(
  computed(() => {
    const rules = {
      itemInstance: {},
    };

    if (!rules[props.field.id]) {
      rules.itemInstance[props.field.id] = {};
    }

    if (props.field.required) {
      rules.itemInstance[props.field.id].required = required;
    }

    return rules;
  }),
  { itemInstance },
  { $autoDirty: true },
);

v$.value.$touch();

const loadLookupList =
  ({ path, display, primary }) =>
  () => {
    return CustomLookupApi.getLookup({ path, display, primary });
  };

const selectElement = (value) => {
  setItemProp({
    path: props.field.id,
    value: {
      id: value.id,
      name: value.name,
    },
  });
};

const selectElements = (value) => {
  setItemProp({
    path: props.field.id,
    value: value.map((item) => ({
      id: item.id,
      name: item.name,
    })),
  });
};
</script>
