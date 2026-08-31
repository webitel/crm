import { adjunctTypeSchema } from '@webitel/api-services/validations';
import deepCopy from 'deep-copy';
import { z } from 'zod';

// a brand new dictionary starts with this system field set (id/audit columns)
// already defined, matching the fields every dictionary record actually gets
// from the backend — crm-local because the field names are i18n keys, not
// part of the shared DataInputDictionary contract.
const defaultFields = [
	{
		id: 'name',
		kind: 'string',
		name: 'customization.customLookups.field.name',
		required: true,
	},
	{
		default: '$(nextval)',
		id: 'id',
		name: 'customization.customLookups.field.id',
		kind: 'int64',
		readonly: true,
		required: true,
	},
	{
		id: 'created_at',
		name: 'customization.customLookups.field.createdAt',
		kind: 'datetime',
		datetime: {
			part: 'full',
			time: 's',
		},
		default: '$(timestamp)',
		readonly: true,
	},
	{
		id: 'created_by',
		name: 'customization.customLookups.field.createdBy',
		kind: 'lookup',
		lookup: {
			path: 'users',
		},
		default: '$(user)',
		readonly: true,
	},
	{
		id: 'updated_at',
		name: 'customization.customLookups.field.modifiedAt',
		kind: 'datetime',
		datetime: {
			part: 'full',
			time: 's',
		},
		always: '$(timestamp)',
		readonly: true,
	},
	{
		id: 'updated_by',
		name: 'customization.customLookups.field.modifiedBy',
		kind: 'lookup',
		lookup: {
			path: 'users',
		},
		always: '$(user)',
		readonly: true,
	},
	{
		id: 'description',
		name: 'vocabulary.description',
		kind: 'string',
	},
];

export const customLookupsSchema = adjunctTypeSchema.extend({
	primary: z.string().optional().default('id'),
	display: z.string().optional().default('name'),
	fields: z
		.array(z.any())
		.optional()
		.default(() => deepCopy(defaultFields)),
});
