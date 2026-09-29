import { describe, expect, it } from 'vitest';

import { checkDisableState } from '../checkDisableState';

const catalog = (state: boolean, parentState: boolean) =>
	({
		state,
		service: [
			{
				id: 'parent',
				state: parentState,
				service: [
					{
						id: 'child',
						state: true,
						service: [
							{
								id: 'grandchild',
								state: true,
							},
						],
					},
				],
			},
		],
	}) as never;

describe('checkDisableState', () => {
	it('disables everything in a disabled catalog', () => {
		expect(
			checkDisableState(catalog(false, true), {
				id: 'parent',
			}),
		).toBe(true);
	});

	it('disables a service under a disabled ancestor', () => {
		expect(
			checkDisableState(catalog(true, false), {
				id: 'grandchild',
			}),
		).toBe(true);
	});

	it('does not count the service itself as its own ancestor', () => {
		expect(
			checkDisableState(catalog(true, false), {
				id: 'parent',
			}),
		).toBe(false);
	});

	it('leaves a service with enabled ancestors, or one it cannot find, enabled', () => {
		expect(
			checkDisableState(catalog(true, true), {
				id: 'grandchild',
			}),
		).toBe(false);
		expect(
			checkDisableState(catalog(true, false), {
				id: 'missing',
			}),
		).toBe(false);
	});
});
