<template>
  <wt-input-text
    v-if="field.kind === FieldType.Text"
    :model-value="value"
    :regle-validation="regleValidation"
    :label="label"
    :required="isRequired"
    :disabled="props.disabled"
    @update:model-value="setValue($event)"
  />
  <wt-input-number
    v-else-if="field.kind === FieldType.Number"
    :model-value="value"
    :regle-validation="regleValidation"
    :label="label"
    :required="isRequired"
    :disabled="props.disabled"
    @update:model-value="setValue($event)"
  />
  <wt-switcher
    v-else-if="field.kind === FieldType.Boolean"
    :label="label"
    :model-value="!!value"
    :required="isRequired"
    :disabled="props.disabled"
    @update:model-value="setValue($event)"
  />
  <wt-single-select
    v-else-if="field.kind === FieldType.Select"
    :label="label"
    :model-value="value"
    :regle-validation="regleValidation"
    :search-method="hasLookupReadAccess && loadLookupList(field.lookup)"
    data-key="id"
    :required="isRequired"
    :disabled="props.disabled || !hasLookupReadAccess"
    @update:model-value="selectElement"
  />
  <wt-multi-select
    v-else-if="field.kind === FieldType.Multiselect"
    :label="label"
    :model-value="value"
    :regle-validation="regleValidation"
    :search-method="hasLookupReadAccess && loadLookupList(field.lookup)"
    data-key="id"
    :required="isRequired"
    :disabled="props.disabled || !hasLookupReadAccess"
    @update:model-value="selectElements"
  />
  <wt-datepicker
    v-else-if="field.kind === FieldType.Calendar"
    :label="label"
    :model-value="value"
    :regle-validation="regleValidation"
    show-time
		clearable
    :timezone="timezone"
    :required="isRequired"
    :disabled="props.disabled"
    @update:model-value="setValue($event)"
  />
</template>

<script setup lang="ts">
import type { SuperCompatibleRegleFieldStatus } from '@regle/core';
import { AdjunctTypeRecordsAPI } from '@webitel/api-services/api';
import type { DataField } from '@webitel/api-services/gen/models';
import { WtObject } from '@webitel/ui-sdk/enums';
import get from 'lodash/get';
import set from 'lodash/set';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { getWtObjectByLookupPath } from '../../../../../../../app/scripts/getWtObjectByLookupPath';
import { FieldType } from '../../../../customization/modules/custom-lookups/enums/FieldType';

const props = defineProps<{
	// loosely typed: rendered by 3 different parents (custom-lookup, cases,
	// contacts), each with its own shape for a dictionary field definition
	field: Partial<DataField> & Record<string, any>;
	itemInstance: Record<string, any>;
	// If the field is nested in the itemInstance object
	pathToField?: string;
	// pre-resolved by the parent card store's own regle validation schema —
	// this component doesn't know about the parent's field nesting/naming
	regleValidation?: SuperCompatibleRegleFieldStatus;
	disabled?: boolean;
	timezone?: string;
}>();

const { t } = useI18n();

// Check read access for lookup target object
const { hasReadAccess: hasLookupReadAccess } = useUserAccessControl(
	getWtObjectByLookupPath(props.field.lookup?.path) ?? WtObject.CustomLookup,
);

const value = computed(() => {
	if (props.pathToField) {
		return get(props.itemInstance, `${props.pathToField}.${props.field.id}`);
	}

	return props.itemInstance[props.field.id];
});

const label = computed(() => {
	return t(props.field?.name || 'vocabulary.labels');
});

const isRequired = computed(() => {
	return props.field.required;
});

const setValue = (value: unknown) => {
	set(
		props.itemInstance,
		props.pathToField
			? `${props.pathToField}.${props.field.id}`
			: props.field.id,
		value,
	);
};

const loadLookupList = ({
	path,
	display,
	primary,
}: NonNullable<DataField['lookup']>) => {
	return (params: Record<string, unknown>) => {
		return AdjunctTypeRecordsAPI.getLookup({
			...params,
			path,
			display,
			primary,
		});
	};
};

const selectElement = (
	value: {
		id?: unknown;
		name?: unknown;
	} | null,
) => {
	if (!value || Object.values(value).length === 0) {
		return setValue(null);
	}

	setValue({
		id: value.id,
		name: value.name,
	});
};

const selectElements = (
	value: Array<{
		id: unknown;
		name: unknown;
	}>,
) => {
	setValue(
		value.map((item) => ({
			id: item.id,
			name: item.name,
		})),
	);
};
</script>
