import { caseSchema } from '@webitel/api-services/validations';
import { computed } from 'vue';
import { z } from 'zod';

import { caseCustomFields } from '../stores/_internals/caseCustomFields';

function requiredIssue(path) {
	return {
		code: 'custom',
		path,
		params: {
			i18nKey: 'required',
		},
	};
}

function applyCaseRequiredFields(schema): z.ZodType {
	return schema.superRefine((data, ctx) => {
		if (!data.subject)
			ctx.addIssue(
				requiredIssue([
					'subject',
				]),
			);
		if (!data.source?.id)
			ctx.addIssue(
				requiredIssue([
					'source',
				]),
			);
		if (!data.reporter?.id)
			ctx.addIssue(
				requiredIssue([
					'reporter',
				]),
			);
		if (!data.service?.id)
			ctx.addIssue(
				requiredIssue([
					'service',
				]),
			);
		if (!data.statusCondition?.id)
			ctx.addIssue(
				requiredIssue([
					'statusCondition',
				]),
			);
		/* priority is required, but set automatically by default and can't be
		 * cleared in the ui */
		if (!data.priority?.id)
			ctx.addIssue(
				requiredIssue([
					'priority',
				]),
			);

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
					{
						params: {
							i18nKey: 'required',
						},
					},
				);
		}
		return acc;
	}, {});

	if (!Object.keys(requiredCustomShape).length) {
		return applyCaseRequiredFields(caseSchema);
	}

	return applyCaseRequiredFields(
		caseSchema.extend({
			custom: z.object(requiredCustomShape).passthrough().default({}),
		}),
	);
});
