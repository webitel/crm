<template>
  <wt-single-select
    :model-value="value.kind"
    :options="options"
    :label="t('vocabulary.type')"
    :v="(v$.value as any).kind"
    :disabled="disabled"
    required
    data-key="name"
    option-value="type"
    @update:model-value="changeType"
  />
  <wt-single-select
    v-if="
      value.kind === FieldType.Select || value.kind === FieldType.Multiselect
    "
    :model-value="value.lookup"
    required
    :disabled="disabled"
    :label="t('reusable.object')"
    :search-method="loadLookupList"
    :v="(v$.value as any).lookup"
    data-key="name"
    :show-clear="false"
    @update:model-value="selectObject($event)"
  />
    <!--    We need comment this part of template https://webitel.atlassian.net/browse/WTEL-6697-->
    <!--    <template #option="{ option }">-->
    <!--      {{ getOptionLocale(option) }}-->
    <!--    </template>-->
    <!--    <template #singleLabel="{ option }">-->
    <!--      {{ getOptionLocale(option) }}-->
    <!--    </template>-->
</template>

<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { ObjectsAPI } from '@webitel/api-services/api';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { FieldType } from '../../enums/FieldType';

const props = defineProps<{
	value: Record<string, any>;
	disabled?: boolean;
}>();

const { t } = useI18n();

const v$ = useVuelidate(
	computed(() => ({
		value: {
			kind: {
				required,
			},
			lookup: {
				required: (value: unknown) => {
					if (
						props.value.kind === FieldType.Select ||
						props.value.kind === FieldType.Multiselect
					) {
						return value;
					}

					return true;
				},
			},
		},
	})),
	{
		value: props.value,
	} as any,
	{
		$autoDirty: true,
	},
);

v$.value.$touch();

const options = [
	{
		name: t(`customization.customLookups.fieldType.${FieldType.Text}`),
		type: FieldType.Text,
	},
	{
		name: t(`customization.customLookups.fieldType.${FieldType.Number}`),
		type: FieldType.Number,
	},
	{
		name: t(`customization.customLookups.fieldType.${FieldType.Select}`),
		type: FieldType.Select,
	},
	{
		name: t(`customization.customLookups.fieldType.${FieldType.Multiselect}`),
		type: FieldType.Multiselect,
	},
	{
		name: t(`customization.customLookups.fieldType.${FieldType.Calendar}`),
		type: FieldType.Calendar,
	},
	{
		name: t(`customization.customLookups.fieldType.${FieldType.Boolean}`),
		type: FieldType.Boolean,
	},
];

const changeType = (value: FieldType) => {
	if (value === FieldType.Select || value === FieldType.Multiselect) {
		props.value.list = null;
		props.value.lookup = null;
	}

	props.value.default = value === FieldType.Boolean ? false : null;
	props.value.required = false;

	props.value.kind = value;
};
const selectObject = (value: Record<string, any>) => {
	props.value.lookup = {
		path: value.path,
		name: value.name,
		display: value.display,
		primary: value.primary,
	};
};
const loadLookupList = (params: Record<string, unknown>) => {
	return ObjectsAPI.getLookup(params);
};
</script>
