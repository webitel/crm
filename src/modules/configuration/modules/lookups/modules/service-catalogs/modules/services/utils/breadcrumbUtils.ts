import type { WebitelCasesService } from '@webitel/api-services/gen/models';
import { CrmSections } from '@webitel/ui-sdk/enums';

import prettifyBreadcrumbName from '../../../utils/prettifyBreadcrumbName';

interface ServiceCrumb {
	name?: string;
	route?: {
		name: string;
		params: {
			catalogId?: string;
			rootId?: string;
		};
	};
}

export function findServicePath(
	currentServiceId: string,
	catalog: {
		service?: WebitelCasesService[];
	},
	path: WebitelCasesService[] = [],
): WebitelCasesService[] | null {
	const services = catalog?.service;

	if (!Array.isArray(services)) return null;

	for (const service of services) {
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

export function buildServiceCrumbs(
	servicePath: WebitelCasesService[],
	catalogId?: string,
): ServiceCrumb[] {
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
		const crumb: ServiceCrumb = {
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
