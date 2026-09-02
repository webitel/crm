import type { DataField } from '@webitel/api-services/gen/models';
import { requiredLookupSchema } from '@webitel/api-services/validations';
import { z } from 'zod';

import { FieldType } from '../../../../customization/modules/custom-lookups/enums/FieldType';

function buildFieldSchema(field: DataField): z.ZodType {
	switch (field.kind) {
		case FieldType.Number:
			return z.number();
		case FieldType.Boolean:
			return z.boolean();
		case FieldType.Select:
			return requiredLookupSchema.nullable();
		case FieldType.Multiselect:
			return z.array(requiredLookupSchema);
		case FieldType.Calendar:
		case FieldType.Text:
		default:
			return z.string();
	}
}

// dynamic schema for a custom-lookup record — field shape depends on the
// currently open dictionary's schema (see stores/_internals/customLookupFields.ts)
export function buildCustomLookupValidationSchema(
	fields: DataField[] = [],
): z.ZodType {
	const shape = fields.reduce<Record<string, z.ZodType>>((acc, field) => {
		if (
			!field.id ||
			field.hidden ||
			field.always ||
			(field.readonly && field.kind !== FieldType.Boolean)
		) {
			return acc;
		}

		const fieldSchema = buildFieldSchema(field);
		acc[field.id] = field.required ? fieldSchema : fieldSchema.nullish();

		return acc;
	}, {});

	return z.object(shape).passthrough();
}
