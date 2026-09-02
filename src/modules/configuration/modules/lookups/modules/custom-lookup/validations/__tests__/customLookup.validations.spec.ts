import type { DataField } from '@webitel/api-services/gen/models';

import { FieldType } from '../../../../../customization/modules/custom-lookups/enums/FieldType';
import { buildCustomLookupValidationSchema } from '../customLookup.validations';

describe('buildCustomLookupValidationSchema', () => {
	it('does not require a readonly field the UI never lets the user fill in', () => {
		const fields = [
			{
				id: 'id',
				kind: FieldType.Number,
				readonly: true,
				required: true,
			},
			{
				id: 'name',
				kind: FieldType.Text,
				required: true,
			},
		] as DataField[];

		const schema = buildCustomLookupValidationSchema(fields);

		expect(
			schema.safeParse({
				name: 'value',
			}).success,
		).toBe(true);
	});

	it('still requires a readonly boolean field, which stays user-editable', () => {
		const fields = [
			{
				id: 'flag',
				kind: FieldType.Boolean,
				readonly: true,
				required: true,
			},
		] as DataField[];

		const schema = buildCustomLookupValidationSchema(fields);

		expect(schema.safeParse({}).success).toBe(false);
		expect(
			schema.safeParse({
				flag: false,
			}).success,
		).toBe(true);
	});

	it('accepts the timestamp number wt-datepicker writes for a required calendar field', () => {
		const fields = [
			{
				id: 'meetingAt',
				kind: FieldType.Calendar,
				required: true,
			},
		] as DataField[];

		const schema = buildCustomLookupValidationSchema(fields);

		expect(
			schema.safeParse({
				meetingAt: Date.now(),
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				meetingAt: '2026-09-02T12:00:00.000Z',
			}).success,
		).toBe(false);
	});

	it('still skips an always-set field regardless of readonly', () => {
		const fields = [
			{
				id: 'updatedAt',
				kind: FieldType.Calendar,
				readonly: true,
				always: '$(timestamp)',
				required: true,
			},
		] as DataField[];

		const schema = buildCustomLookupValidationSchema(fields);

		expect(schema.safeParse({}).success).toBe(true);
	});
});
