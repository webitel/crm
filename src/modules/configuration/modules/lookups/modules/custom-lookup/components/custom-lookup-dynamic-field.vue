<template>
  <wt-input
    v-if="field.kind === FieldType.TEXT"
    :value="itemInstance[field.id]"
    :v="field.required ? v$.itemInstance[field.id] : null"
    :label="field.name"
    :required="field.required"
    @input="setItemProp({ prop: field.id, value: $event })"
  />
  <wt-input
    v-if="field.kind === FieldType.NUMBER"
    :value="itemInstance[field.id]"
    :v="field.required ? v$.itemInstance[field.id] : null"
    :label="field.name"
    type="number"
    :required="field.required"
    @input="setItemProp({ prop: field.id, value: $event })"
  />
  <wt-switcher
    v-if="field.kind === FieldType.BOOLEAN"
    :label="field.name"
    :value="itemInstance[field.id]"
    :v="field.required ? v$.itemInstance[field.id] : null"
    :required="field.required"
    @change="setItemProp({ path: field.id, value: $event })"
  />
  <wt-select
    v-if="field.kind === FieldType.SELECT"
    :label="field.name"
    :value="itemInstance[field.id]"
    :v="field.required ? v$.itemInstance[field.id] : null"
    :search-method="loadLookupList(field.lookup.type)"
    track-by="name"
    clearable
    :required="field.required"
    @input="selectElement"
  />
  <wt-select
    v-if="field.kind === FieldType.MULTISELECT"
    :label="field.name"
    :value="itemInstance[field.id]"
    :v="field.required ? v$.itemInstance[field.id] : null"
    :search-method="loadLookupList(field.lookup.type)"
    track-by="name"
    clearable
    multiple
    :required="field.required"
    @input="selectElements"
  />
  <wt-datepicker
    v-if="field.kind === FieldType.CALENDAR"
    :label="field.name"
    :value="itemInstance[field.id]"
    mode="datetime"
    :required="field.required"
    @input="setItemProp({ path: field.id, value: +$event })"
  />
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed } from 'vue';

import FieldType from '../../../../../../customization/modules/custom-lookups/enums/FieldType.enum';
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

const v$ = useVuelidate(
  computed(() => {
    if (props.field.required) {
      return {
        itemInstance: {
          [props.field.id]: {
            required: props.field.required ? required : undefined,
          },
        },
      };
    }

    return {};
  }),
  { itemInstance },
  { $autoDirty: true },
);

v$.value.$touch();

const loadLookupList = (type) => () => {
  return CustomLookupApi.getLookup({ type });
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
