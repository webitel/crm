<template>
  <wt-input
    v-if="field.kind === FieldType.Text"
    :value="value"
    :v="validation"
    :label="label"
    :required="isRequired"
    :disabled="props.disable"
    @input="setValue($event)"
  />
  <wt-input
    v-else-if="field.kind === FieldType.Number"
    :value="value"
    :v="validation"
    :label="label"
    type="number"
    :required="isRequired"
    :disabled="props.disable"
    @input="setValue($event)"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.Boolean"
    :label="label"
    :value="!!value"
    :v="validation"
    :required="isRequired"
    :disabled="props.disable"
    @change="setValue($event)"
  />
  <wt-select
    v-else-if="field.kind === FieldType.Select"
    :label="label"
    :value="value"
    :v="validation"
    :search-method="loadLookupList(field.lookup)"
    track-by="id"
    clearable
    :required="isRequired"
    :disabled="props.disable"
    @input="selectElement"
  />
  <wt-select
    v-else-if="field.kind === FieldType.Multiselect"
    :label="label"
    :value="value"
    :v="validation"
    :search-method="loadLookupList(field.lookup)"
    track-by="id"
    clearable
    multiple
    :required="isRequired"
    :disabled="props.disable"
    @input="selectElements"
  />
  <wt-datepicker
    v-else-if="field.kind === FieldType.Calendar"
    :label="label"
    :value="value"
    :v="v$.itemInstance[field.id]"
    mode="datetime"
    :required="isRequired"
    :disabled="props.disable"
    @input="setValue(+$event)"
  />
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { snakeToCamel } from '@webitel/ui-sdk/scripts';
import { useCardStore } from '@webitel/ui-sdk/store';
import get from 'lodash/get';
import set from 'lodash/set';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  FieldType,
} from '../../../../../../customization/modules/custom-lookups/enums/FieldType.enum';
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
  disable: {
    type: Boolean,
    default: false,
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
        set(
          rules,
          `itemInstance.${props.pathToField}.${props.field.id}.required`,
          required,
        );
      } else {
        set(rules, `itemInstance.${props.field.id}.required`, required);
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
    return get(itemInstance.value, `${props.pathToField}.${props.field.id}`);
  }

  return itemInstance.value[snakeToCamel(props.field.id)];
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
      ? `${props.pathToField}.${snakeToCamel(props.field.id)}`
      : snakeToCamel(props.field.id),
    value,
  });
};

const loadLookupList = ({ path, display, primary }) => {
  return (params) => {
    return CustomLookupApi.getLookup({
      ...params,
      path,
      display,
      primary,
    });
  };
};

const selectElement = (value) => {
  if (Object.values(value).length === 0) {
    return setValue(null);
  }

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
