<template>
  <wt-input
    v-if="field.kind === FieldType.Text"
    :value="value"
    :v="validation"
    :label="label"
    :required="isRequired"
    @input="setValue($event)"
  />
  <wt-input
    v-else-if="field.kind === FieldType.Number"
    :value="value"
    :v="validation"
    :label="label"
    type="number"
    :required="isRequired"
    @input="setValue($event)"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.Boolean"
    :label="label"
    :value="value"
    :v="validation"
    :required="isRequired"
    @change="setValue($event)"
  />
  <wt-select
    v-else-if="field.kind === FieldType.Select"
    :label="label"
    :value="value"
    :v="validation"
    :search-method="loadLookupList(field.lookup?.type)"
    track-by="name"
    clearable
    :required="isRequired"
    @input="selectElement"
  />
  <wt-select
    v-else-if="field.kind === FieldType.Multiselect"
    :label="label"
    :value="value"
    :v="validation"
    :search-method="loadLookupList(field.lookup?.type)"
    track-by="name"
    clearable
    multiple
    :required="isRequired"
    @input="selectElements"
  />
  <wt-datepicker
    v-else-if="field.kind === FieldType.Calendar"
    :label="label"
    :value="value"
    mode="datetime"
    :required="isRequired"
    @input="setValue(+$event)"
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
  // If the field is nested in the itemInstance object
  // eslint-disable-next-line vue/require-default-prop
  pathToField: {
    type: String,
  },
});

const { itemInstance, setItemProp } = useCardStore(props.namespace);

const { t } = useI18n();

const v$ = useVuelidate(
  computed(() => {
    let rules;

    if (props.pathToField) {
      rules = {
        itemInstance: {
          [props.pathToField]: {},
        },
      };
    } else {
      rules = {
        itemInstance: {},
      };
    }

    if (
      props.pathToField &&
      !rules.itemInstance[props.pathToField][props.field.id]
    ) {
      rules.itemInstance[props.pathToField][props.field.id] = {};
    }

    if (!props.pathToField && !rules.itemInstance[props.field.id]) {
      rules.itemInstance[props.field.id] = {};
    }

    if (props.field.required) {
      if (props.pathToField) {
        rules.itemInstance[props.pathToField][props.field.id].required =
          required;
      } else {
        rules.itemInstance[props.field.id].required = required;
      }
    }

    return rules;
  }),
  { itemInstance },
  { $autoDirty: true },
);

v$.value.$touch();

const value = computed(() => {
  if (props.pathToField) {
    return itemInstance.value[props.pathToField][props.field.id];
  }

  return itemInstance.value[props.field.id];
});

const validation = computed(() => {
  if (props.pathToField) {
    return v$.value.itemInstance[props.pathToField][props.field.id];
  }

  return v$.value.itemInstance[props.field.id];
});

const label = computed(() => {
  return t(props.field?.name || 'vocabulary.labels');
});

const isRequired = computed(() => {
  return props.field.required;
});

const setValue = (value) => {
  setItemProp({
    path: props.pathToField
      ? `${props.pathToField}.${props.field.id}`
      : props.field.id,
    value,
  });
};

const loadLookupList = (type) => () => {
  return CustomLookupApi.getLookup({ type });
};

const selectElement = (value) => {
  setValue({
    id: value.id,
    name: value.name,
  });
};

const selectElements = (value) => {
  setValue(
    value.map((item) => ({
      id: item.id,
      name: item.name,
    })),
  );
};
</script>
