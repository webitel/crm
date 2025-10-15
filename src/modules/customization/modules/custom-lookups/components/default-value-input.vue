<template>
  {{ value }}
  <wt-select
    v-if="value.kind === FieldType.Select || value.kind === FieldType.Multiselect"
    :value="value.default"
    :options="options"
    :label="t('customization.customLookups.defaultValue')"
    required
    :v="v.value.default"
    track-by="name"
    :search-method="loadLookupList"
    :multiple="multiple"
    use-value-from-options-by-prop="type"
    @input="selectValue"
  />
  <wt-input
    v-else-if="value.kind !== FieldType.Boolean"
    :label="t('customization.customLookups.defaultValue')"
    :value="value.default"
    required
    :v="v.value.default"
    :type="value.kind === FieldType.Number ? 'number' : 'string'"
    @input="value.default = $event"
  />
</template>

<script setup lang="ts">
import { computed, defineProps, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import CustomLookupApi
  from '../../../../configuration/modules/lookups/modules/custom-lookup/api/custom-lookups';
import { FieldType } from '../enums/FieldType';
import { CustomLookupField } from '../types/customLookupField';

const props = defineProps<{
  value: CustomLookupField,
  isNew: boolean,
  v: any
}>();

const { t } = useI18n();
const options = ref([]);
const multiple = computed(() => false);

const getLoadLookupList = (lookup) => {
  return (params) => CustomLookupApi.getLookup({
    ...params,
    path: lookup.path,
    display: lookup.display,
    primary: lookup.primary,
  });
};
const loadLookupList = ref(getLoadLookupList(props.value.lookup));

const selectValue = (event) => {
  console.log('selectValue', event);
};

watch(() => props.value.kind, (newValue) => {
  console.log('watch on kind', newValue);
});
watch(() => props.value.lookup, (newValue) => {
  console.log('newValue', newValue);
  loadLookupList.value = getLoadLookupList(newValue);
});
</script>
