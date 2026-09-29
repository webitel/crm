import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ServicePath from '../service-path.vue';

const catalog = {
	name: 'Billing',
	service: [
		{
			id: 1,
			name: 'Refunds',
			service: [
				{
					id: 2,
					name: 'Card refund',
				},
			],
		},
	],
};

const text = (props: Record<string, unknown>) =>
	mount(ServicePath, {
		props,
	}).text();

describe('service-path', () => {
	it('prefixes the catalog and walks down to the service', () => {
		expect(
			text({
				service: {
					id: 2,
					name: 'Card refund',
				},
				catalog,
			}),
		).toBe('Billing / Refunds / Card refund');
	});

	it('still names a service the catalog does not contain', () => {
		expect(
			text({
				service: {
					id: 9,
					name: 'Orphan',
				},
				catalog,
			}),
		).toBe('Billing / Orphan');
	});

	it('without a catalog, follows the service parent chain', () => {
		expect(
			text({
				service: {
					name: 'Card refund',
					service: [
						{
							name: 'Refunds',
						},
					],
				},
			}),
		).toBe('Refunds / Card refund');
	});
});
