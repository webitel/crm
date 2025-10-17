<template>
  <wt-select
    v-if="displaySelect"
    :key="lookup?.path + value.kind"
    :value="value.default"
    :options="options"
    :label="t('customization.customLookups.defaultValue')"
    required
    :v="v.value.default"
    :track-by="lookup?.primary || 'id'"
    :search-method="loadLookupList"
    :multiple="multiple"
    @input="selectValue($event)"
  />
  <wt-input
    v-else-if="displayInput"
    :key="kind"
    :label="t('customization.customLookups.defaultValue')"
    :value="value.default"
    required
    :v="v.value.default"
    :type="inputType"
    @input="value.default = $event"
  />
</template>

<script setup lang="ts">
import deepCopy from 'deep-copy';
import { computed, defineProps, ref, toRefs, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import CustomLookupApi
  from '../../../../configuration/modules/lookups/modules/custom-lookup/api/custom-lookups';
import { FieldType } from '../enums/FieldType';
import {
  CustomLookupField,
  CustomLookupLookup,
  CustomLookupValue,
} from '../types/customLookupField';

const props = defineProps<{
  value: CustomLookupField,
  v: any
}>();

const { lookup, kind } = toRefs(props.value);

const { t } = useI18n();
const options = ref([]);
const displaySelect = computed(() => kind.value === FieldType.Select || kind.value === FieldType.Multiselect);
const displayInput = computed(() => kind.value !== FieldType.Boolean);
const multiple = computed(() => kind.value === FieldType.Multiselect);
const inputType = computed(() => kind.value === FieldType.Number ? 'number' : 'string');

const getLoadLookupList = (lookup: CustomLookupLookup) => {
  return (params) => CustomLookupApi.getLookup({
    ...params,
    path: lookup?.path,
    display: lookup?.display || 'name',
    primary: lookup?.primary || 'id',
  });
};
const loadLookupList = ref(getLoadLookupList(lookup.value));

const selectValue = (event: CustomLookupValue) => {
  if (!Object.keys(event).length) {
    return props.value.default = null;
  }

  props.value.default = deepCopy(event);
};

watch(() => lookup.value, (newValue) => {
  props.value.default = null;
  loadLookupList.value = getLoadLookupList(newValue);
});
</script>
