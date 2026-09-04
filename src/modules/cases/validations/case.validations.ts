import {
	caseSchema,
	filledLookupSchema,
} from '@webitel/api-services/validations';
import { computed } from 'vue';
import { z } from 'zod';

import { caseCustomFields } from '../stores/_internals/caseCustomFields';

const requiredParams = {
	params: {
		i18nKey: 'required',
	},
};

function requiredIssue(path) {
	return {
		code: 'custom',
		path,
		...requiredParams,
	};
}

// build on caseSchema's own shapes instead of retyping them, so a change to
// the library schema can't silently drift out of sync with these
const requiredSubjectShape = caseSchema.shape.subject.refine(
	(value) => Boolean(value),
	requiredParams,
);

const requiredStatusConditionShape = caseSchema.shape.statusCondition
	.removeDefault()
	.refine((value) => Boolean(value?.id), requiredParams);

function applyCaseRequiredFields(schema): z.ZodType {
	return schema.superRefine((data, ctx) => {
		if (!data.statusCondition?.final) return;

		if (!data.closeReason?.id)
			ctx.addIssue(
				requiredIssue([
					'closeReason',
				]),
			);
		if (!data.closeResult)
			ctx.addIssue(
				requiredIssue([
					'closeResult',
				]),
			);
	});
}

export const caseValidationSchema = computed(() => {
	const requiredCustomShape = caseCustomFields.value.reduce((acc, field) => {
		if (field.required) {
			acc[field.id] = z
				.any()
				.refine(
					(value) => value !== null && value !== undefined && value !== '',
					requiredParams,
				);
		}
		return acc;
	}, {});

	let schemaWithRequiredFields = caseSchema.extend({
		subject: requiredSubjectShape,
		source: filledLookupSchema,
		reporter: filledLookupSchema,
		service: filledLookupSchema,
		priority: filledLookupSchema,
		statusCondition: requiredStatusConditionShape,
	});

	if (Object.keys(requiredCustomShape).length) {
		schemaWithRequiredFields = schemaWithRequiredFields.extend({
			custom: z.object(requiredCustomShape).passthrough().default({}),
		});
	}

	return applyCaseRequiredFields(schemaWithRequiredFields);
});
