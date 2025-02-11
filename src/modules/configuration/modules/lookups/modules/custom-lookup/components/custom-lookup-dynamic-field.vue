<template>
  <wt-input
    v-if="field.kind === FieldType.TEXT"
    :value="itemInstance[field.id]"
    :label="field.name"
    @input="setItemProp({ prop: field.id, value: $event })"
  />
  <wt-input
    v-if="field.kind === FieldType.NUMBER"
    :value="itemInstance[field.id]"
    :label="field.name"
    type="number"
    @input="setItemProp({ prop: field.id, value: $event })"
  />
  <wt-switcher
    v-if="field.kind === FieldType.BOOLEAN"
    :label="field.name"
    :value="itemInstance[field.id]"
    @change="setItemProp({ path: field.id, value: $event })"
  />
  <wt-select
    v-if="field.kind === FieldType.SELECT"
    :label="field.name"
    :value="itemInstance[field.id]"
    :search-method="loadLookupList(field.lookup.type)"
    track-by="name"
    clearable
    @input="selectTest"
  />
  <wt-datepicker
    v-if="field.kind === FieldType.CALENDAR"
    :label="field.name"
    :value="itemInstance[field.id]"
    mode="datetime"
    @input="setItemProp({ path: 'validFrom', value: +$event })"
  />
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';

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

const loadLookupList = (type) => () => {
  return CustomLookupApi.getLookup({ type });
};

const selectTest = (value) => {
  console.log(value);
};
</script>
