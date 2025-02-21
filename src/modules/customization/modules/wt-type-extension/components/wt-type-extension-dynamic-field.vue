<template>
  <wt-input
    v-if="field.kind === FieldType.Text"
    :value="itemInstance.custom[field.id]"
    :v="v$.itemInstance.custom[field.id]"
    :label="t(field.name)"
    :required="field.required"
    @input="setItemProp({ path: `custom.${field.id}`, value: $event })"
  />
  <wt-input
    v-else-if="field.kind === FieldType.Number"
    :value="itemInstance.custom[field.id]"
    :v="v$.itemInstance.custom[field.id]"
    :label="t(field.name)"
    type="number"
    :required="field.required"
    @input="setItemProp({ path: `custom.${field.id}`, value: $event })"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.Boolean"
    :label="t(field.name)"
    :value="itemInstance.custom[field.id]"
    :v="v$.itemInstance.custom[field.id]"
    :required="field.required"
    @change="setItemProp({ path: `custom.${field.id}`, value: $event })"
  />
  <wt-select
    v-else-if="field.kind === FieldType.Select"
    :label="t(field.name)"
    :value="itemInstance.custom[field.id]"
    :v="v$.itemInstance.custom[field.id]"
    :search-method="loadLookupList(field.lookup.type)"
    track-by="name"
    clearable
    :required="field.required"
    @input="selectElement"
  />
  <wt-select
    v-else-if="field.kind === FieldType.Multiselect"
    :label="t(field.name)"
    :value="itemInstance.custom[field.id]"
    :v="v$.itemInstance.custom[field.id]"
    :search-method="loadLookupList(field.lookup.type)"
    track-by="name"
    clearable
    multiple
    :required="field.required"
    @input="selectElements"
  />
  <wt-datepicker
    v-else-if="field.kind === FieldType.Calendar"
    :label="t(field.name)"
    :value="itemInstance.custom[field.id]"
    mode="datetime"
    :required="field.required"
    @input="setItemProp({ path: `custom.${field.id}`, value: +$event })"
  />
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import CustomLookupApi from '../../custom-lookups/api/custom-lookups.js';
import { FieldType } from '../../custom-lookups/enums/FieldType.enum';

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

const v$ = useVuelidate(
  computed(() => {
    const rules = {
      itemInstance: {
        custom: {},
      },
    };

    if (!rules[props.field.id]) {
      rules.itemInstance.custom[props.field.id] = {};
    }

    if (props.field.required) {
      rules.itemInstance.custom[props.field.id].required = required;
    }

    return rules;
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
    path: `custom.${props.field.id}`,
    value: {
      id: value.id,
      name: value.name,
    },
  });
};

const selectElements = (value) => {
  setItemProp({
    path: `custom.${props.field.id}`,
    value: value.map((item) => ({
      id: item.id,
      name: item.name,
    })),
  });
};
</script>
