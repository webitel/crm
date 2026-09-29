import { buildServiceCrumbs } from '../breadcrumbUtils';

const catalog = {
	service: [
		{
			id: 'a',
			name: 'Root service',
			service: [
				{
					id: 'b',
					name: 'Nested service',
					service: [
						{
							id: 'c',
							name: 'Deeply nested service',
						},
					],
				},
			],
		},
	],
};

describe('buildServiceCrumbs', () => {
	it('returns an empty list for an empty path', () => {
		expect(buildServiceCrumbs([])).toEqual([]);
	});

	it('links every crumb except the last for a short path', () => {
		const path = [
			catalog.service[0],
			catalog.service[0].service[0],
		];

		const crumbs = buildServiceCrumbs(path, 'catalog-1');

		expect(crumbs).toEqual([
			{
				name: 'Root service',
				route: {
					name: 'service-catalogs-services',
					params: {
						catalogId: 'catalog-1',
						rootId: 'a',
					},
				},
			},
			{
				name: 'Nested service',
			},
		]);
	});

	it('collapses a path deeper than two levels behind an ellipsis', () => {
		const path = [
			catalog.service[0],
			catalog.service[0].service[0],
			catalog.service[0].service[0].service[0],
		];

		const crumbs = buildServiceCrumbs(path, 'catalog-1');

		expect(crumbs).toHaveLength(3);
		expect(crumbs[0]).toEqual({
			name: '···',
		});
		expect(crumbs[1].name).toBe('Nested service');
		expect(crumbs[2]).toEqual({
			name: 'Deeply nested service',
		});
	});
});
