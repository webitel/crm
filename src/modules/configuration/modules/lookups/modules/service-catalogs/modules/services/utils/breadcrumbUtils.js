import { CrmSections } from '@webitel/ui-sdk/enums';

import prettifyBreadcrumbName from '../../../utils/prettifyBreadcrumbName.js';

export function findServicePath(currentServiceId, catalog, path = []) {
	for (const service of catalog.service) {
		const newPath = [
			...path,
			service,
		];

		if (service.id === currentServiceId) return newPath;

		if (Array.isArray(service.service) && service.service.length > 0) {
			const result = findServicePath(currentServiceId, service, newPath);
			if (result) return result;
		}
	}
	return null;
}

export function buildServiceCrumbs(servicePath, catalogId) {
	if (!servicePath || servicePath.length === 0) return [];

	if (servicePath.length > 2) {
		return [
			{
				name: '···',
			},
			{
				name: prettifyBreadcrumbName(servicePath[servicePath.length - 2].name),
				route: {
					name: `${CrmSections.ServiceCatalogs}-services`,
					params: {
						catalogId,
						rootId: servicePath[servicePath.length - 2].id,
					},
				},
			},
			{
				name: prettifyBreadcrumbName(servicePath[servicePath.length - 1].name),
			},
		];
	}

	return servicePath.map((service, index) => {
		const crumb = {
			name: prettifyBreadcrumbName(service.name),
		};
		if (index < servicePath.length - 1) {
			crumb.route = {
				name: `${CrmSections.ServiceCatalogs}-services`,
				params: {
					catalogId,
					rootId: service.id,
				},
			};
		}
		return crumb;
	});
}
