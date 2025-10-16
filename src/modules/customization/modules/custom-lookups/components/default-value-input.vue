<template>
  <wt-select
    v-if="value.kind === FieldType.Select || value.kind === FieldType.Multiselect"
    :key="value.lookup?.path + value.kind"
    :value="value.default"
    :options="options"
    :label="t('customization.customLookups.defaultValue')"
    required
    :v="v.value.default"
    :track-by="value.lookup?.primary || 'id'"
    :search-method="loadLookupList"
    :multiple="multiple"
    @input="selectValue($event)"
  />
  <wt-input
    v-else-if="value.kind !== FieldType.Boolean"
    :key="value.kind"
    :label="t('customization.customLookups.defaultValue')"
    :value="value.default"
    required
    :v="v.value.default"
    :type="value.kind === FieldType.Number ? 'number' : 'string'"
    @input="value.default = $event"
  />
</template>

<script setup lang="ts">
import deepCopy from 'deep-copy';
import { computed, defineProps, ref, watch } from 'vue';
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

const { t } = useI18n();
const options = ref([]);
const multiple = computed(() => props.value.kind === FieldType.Multiselect);

const getLoadLookupList = (lookup: CustomLookupLookup) => {
  return (params) => CustomLookupApi.getLookup({
    ...params,
    path: lookup?.path,
    display: lookup?.display || 'name',
    primary: lookup?.primary || 'id',
  });
};
const loadLookupList = ref(getLoadLookupList(props.value.lookup));

const selectValue = (event: CustomLookupValue) => {
  if (!Object.keys(event).length) {
    return props.value.default = null;
  }

  props.value.default = deepCopy(event);
};

watch(() => props.value.lookup, (newValue) => {
  props.value.default = null;
  loadLookupList.value = getLoadLookupList(newValue);
});
</script>
