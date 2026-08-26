import { contactSchema } from '@webitel/api-services/validations';
import { computed } from 'vue';
import { z } from 'zod';

import { contactCustomFields } from '../stores/_internals/contactCustomFields';

export const contactValidationSchema = computed(() => {
	const requiredCustomShape = contactCustomFields.value.reduce((acc, field) => {
		if (field.required) {
			acc[field.id] = z
				.any()
				.refine(
					(value) => value !== null && value !== undefined && value !== '',
					{
						message: 'required',
					},
				);
		}
		return acc;
	}, {});

	if (!Object.keys(requiredCustomShape).length) {
		return contactSchema;
	}

	return contactSchema.extend({
		custom: z.object(requiredCustomShape).passthrough().default({}),
	});
});
