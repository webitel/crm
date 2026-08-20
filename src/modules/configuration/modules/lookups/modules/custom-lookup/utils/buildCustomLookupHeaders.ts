import type { DataField } from '@webitel/api-services/gen/models';
import { SortSymbols } from '@webitel/ui-sdk/src/scripts/sortQueryAdapters';

import { FieldType } from '../../../../../../customization/modules/custom-lookups/enums/FieldType';

// table headers for the currently open dictionary's schema — multiselect
// columns aren't sortable, `id` isn't shown as its own column
export function buildCustomLookupHeaders(fields: DataField[] = []) {
	return fields
		.filter((field) => field.id && !field.hidden && field.id !== 'id')
		.map((field) => ({
			value: field.id,
			locale: field.name,
			readonly: field.readonly,
			required: field.required,
			show: true,
			field: field.id,
			kind: field.kind,
			sort: field.kind === FieldType.Multiselect ? undefined : SortSymbols.NONE,
		}));
}
