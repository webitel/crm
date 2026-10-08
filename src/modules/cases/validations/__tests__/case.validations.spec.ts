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
describe('caseValidationSchema identity fields', () => {
	const validateDraft = async (draft: Record<string, unknown>) => {
		const state = ref(draft);
		const scope = effectScope(true);
		// biome-ignore lint/suspicious/noExplicitAny: regle's inferred state type
		let r$: any;

		scope.run(() => {
			({ r$ } = useRegleSchema(state, caseValidationSchema.value, {}));
		});

		return r$.$validate();
	};

	const filledDraft = {
		etag: 'SVQwkSh',
		id: '1353',
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
	};

	/**
	 * `$validate()`'s returned data is sent straight to the update API call
	 * (see `useCardSaveAction`), which reads `etag` off it to build the request
	 * URL. `caseSchema` doesn't declare `etag`/`id` — without passthrough, zod
	 * silently strips them and every save fails with "etag:undefined" from
	 * the backend.
	 */
	it('keeps etag and id (and other fields the form does not declare) through validation', async () => {
		const { valid, data } = await validateDraft(filledDraft);

		expect(valid).toBe(true);
		expect(data).toMatchObject({
			etag: 'SVQwkSh',
			id: '1353',
		});
	});
});

describe('caseValidationSchema required fields', () => {
	const validateDraft = async (draft: Record<string, unknown>) => {
		const state = ref(draft);
		const scope = effectScope(true);
		// biome-ignore lint/suspicious/noExplicitAny: regle's inferred state type
		let r$: any;

		scope.run(() => {
			({ r$ } = useRegleSchema(state, caseValidationSchema.value, {}));
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

describe('caseValidationSchema close fields', () => {
	const filledFinalDraft = {
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
			id: '6',
			name: 'Closed',
			final: true,
		},
		closeReason: {
			id: '7',
			name: 'Resolved',
		},
		closeResult: 'a result',
	};

	const validateDraft = async (draft: Record<string, unknown>) => {
		const state = ref(draft);
		const scope = effectScope(true);
		// biome-ignore lint/suspicious/noExplicitAny: regle's inferred state type
		let r$: any;

		scope.run(() => {
			({ r$ } = useRegleSchema(state, caseValidationSchema.value, {}));
		});

		const { valid } = await r$.$validate();

		return {
			valid,
			closeReason: r$.$fields.closeReason,
			closeResult: r$.$fields.closeResult,
		};
	};

	it('accepts a final case with close reason and result filled', async () => {
		const { valid } = await validateDraft(filledFinalDraft);

		expect(valid).toBe(true);
	});

	it.each([
		{},
		null,
		undefined,
	])('marks close reason invalid on a final case when it is %s', async (closeReason) => {
		const { valid, closeReason: field } = await validateDraft({
			...filledFinalDraft,
			closeReason,
		});

		expect(valid).toBe(false);
		expect(field.$error).toBe(true);
		expect(Object.values(field.$errors).flat()).toHaveLength(1);
	});

	it('marks close fields invalid on a final case while other required fields are still empty', async () => {
		const { valid, closeReason, closeResult } = await validateDraft({
			subject: '',
			statusCondition: filledFinalDraft.statusCondition,
			closeReason: null,
			closeResult: '',
		});

		expect(valid).toBe(false);
		expect(closeReason.$error).toBe(true);
		expect(closeResult.$error).toBe(true);
	});

	it('marks close result invalid on a final case when it is empty', async () => {
		const { valid, closeResult } = await validateDraft({
			...filledFinalDraft,
			closeResult: '',
		});

		expect(valid).toBe(false);
		expect(closeResult.$error).toBe(true);
		expect(closeResult.$errors).toHaveLength(1);
	});

	it.each([
		{},
		null,
		undefined,
	])('does not require close reason on a non-final case when it is %s', async (closeReason) => {
		const { valid } = await validateDraft({
			...filledFinalDraft,
			statusCondition: {
				id: '5',
				name: 'New',
				initial: true,
			},
			closeReason,
			closeResult: '',
		});

		expect(valid).toBe(true);
	});
});
