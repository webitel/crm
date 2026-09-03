import { useRegleSchema } from '@regle/schemas';
import { describe, expect, it } from 'vitest';
import { effectScope, ref } from 'vue';

import { caseValidationSchema } from '../case.validations';

/**
 * `source`/`reporter`/`service`/`priority`/`statusCondition` default to `{}`,
 * and `subject` used to share a root-level `superRefine` with them. Regle
 * files a `{}`-field's issue under a phantom collection index instead of the
 * field itself, and — once other fields fail their own per-field schema —
 * zod stops running that `superRefine` step at all, so none of these fields
 * ever showed as invalid even though the (disabled) Save button silently
 * agreed something was wrong.
 *
 * [WTEL-10323] (https://webitel.atlassian.net/browse/WTEL-10323)
 */
describe('caseValidationSchema required fields', () => {
	const validateDraft = async (draft: Record<string, unknown>) => {
		const state = ref(draft);
		const scope = effectScope(true);
		// biome-ignore lint/suspicious/noExplicitAny: regle's inferred state type
		let r$: any;

		scope.run(() => {
			({ r$ } = useRegleSchema(state, caseValidationSchema.value as never));
		});

		const result = await r$.$validate();

		return {
			valid: result.valid,
			rootError: r$.$error,
			fieldErrors: Object.fromEntries(
				[
					'subject',
					'source',
					'reporter',
					'service',
					'priority',
					'statusCondition',
				].map((field) => [
					field,
					r$.$fields?.[field]?.$errors,
				]),
			),
		};
	};

	it('reports every required field as invalid on an empty draft', async () => {
		const { valid, rootError, fieldErrors } = await validateDraft({});

		expect(valid).toBe(false);
		expect(rootError).toBe(true);
		expect(fieldErrors.subject).toHaveLength(1);
		expect(fieldErrors.source).toHaveLength(1);
		expect(fieldErrors.reporter).toHaveLength(1);
		expect(fieldErrors.service).toHaveLength(1);
		expect(fieldErrors.priority).toHaveLength(1);
		expect(fieldErrors.statusCondition).toHaveLength(1);
	});

	it('accepts a draft with every required field filled', async () => {
		const { valid, rootError } = await validateDraft({
			subject: 'a subject',
			source: {
				id: '1',
				name: 'Phone',
			},
			reporter: {
				id: '2',
				name: 'Reporter',
			},
			service: {
				id: '3',
				name: 'Service',
			},
			priority: {
				id: '4',
				name: 'Priority',
			},
			statusCondition: {
				id: '5',
				name: 'New',
				initial: true,
			},
		});

		expect(valid).toBe(true);
		expect(rootError).toBe(false);
	});
});
