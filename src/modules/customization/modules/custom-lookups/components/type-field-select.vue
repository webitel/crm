<template>
  <wt-select
    :value="value.kind"
    :options="options"
    :label="$t('vocabulary.type')"
    track-by="name"
    use-value-from-options-by-prop="type"
    @input="changeType"
  />
  <wt-select
    v-if="value.kind === FieldType.SELECT"
    :value="value.lookup"
    :label="$t('reusable.object')"
    :search-method="loadLookupList"
    track-by="name"
    :clearable="false"
    @input="selectSingleObject($event)"
  />
  <wt-select
    v-if="value.kind === FieldType.MULTISELECT"
    :value="value.list?.lookup"
    :label="$t('reusable.object')"
    :search-method="loadLookupList"
    track-by="name"
    :clearable="false"
    @input="selectMultiObject($event)"
  />
</template>

<script setup>
import CustomLookupsApi from '../api/custom-lookups.js';
import FieldType from '../enums/FieldType.enum.js';

const props = defineProps({
  value: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['changeType']);

const options = [
  { name: 'Text', type: FieldType.TEXT },
  { name: 'Number', type: FieldType.NUMBER },
  { name: 'Select', type: FieldType.SELECT },
  { name: 'Multiselect', type: FieldType.MULTISELECT },
  { name: 'Calendar', type: FieldType.CALENDAR },
  { name: 'Boolean', type: FieldType.BOOLEAN },
];

const changeType = (value) => {
  if (value === FieldType.SELECT || value === FieldType.MULTISELECT) {
    props.value.list = null;
    props.value.lookup = null;
  }
  props.value.kind = value;
};
const selectSingleObject = (value) => {
  props.value.lookup = {
    type: value.path,
    name: value.name,
  };
};
const selectMultiObject = (value) => {
  props.value.list = {
    kind: 'lookup',
    lookup: {
      type: value.path,
      name: value.name,
    },
  };
};
const loadLookupList = (params) => {
  return CustomLookupsApi.getLookup(params);
};
</script>

<style scoped lang="scss"></style>
