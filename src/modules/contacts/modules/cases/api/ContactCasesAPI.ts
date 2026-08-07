// TODO: прибрати після рефактору таймлайнів

import { FTSServiceAPI, stringifyCaseFilters } from '@webitel/api-services/api';
import {
	getDefaultGetListResponse,
	getDefaultGetParams,
} from '@webitel/api-services/api/defaults';
import {
	applyTransform,
	camelToSnake,
	generateUrl,
	merge,
	notify,
	sanitize,
	snakeToCamel,
} from '@webitel/api-services/api/transformers';
import type { ApiModule } from '@webitel/ui-sdk/src/api/types/ApiModule';
import { snakeToKebab } from '@webitel/ui-sdk/src/scripts/index';

import instance from '../../../../../app/api/instance.js';

function transformSourceType(data) {
	if (Array.isArray(data)) {
		return data.map((item) => {
			if (item.source?.type) {
				item.source.type = snakeToKebab(item.source.type.toLowerCase());
			}
			return item;
		});
	}

	if (data.source?.type) {
		data.source.type = snakeToKebab(data.source.type.toLowerCase());
	}
	return data;
}

const getContactCasesList = async (params) => {
	const fieldsToSend = [
		'page',
		'size',
		'q',
		'ids',
		'sort',
		'fields',
		'filters',
	];

	let ftsIds: Array<string | number> | undefined;
	const { fts } = params;
	if (fts) {
		try {
			const { items } = await FTSServiceAPI.getList({
				page: params.page,
				size: params.size,
				fts: params.fts,
				sort: params.sort,
				object_name: [
					'cases',
					'case_comments',
				],
			});
			ftsIds = items.map(({ id }) => id);
		} catch {
			// skip error, load cases without fts
		}
	}

	// @author @Lera24
	// [WTEL-6766](https://webitel.atlassian.net/browse/WTEL-6766)
	// Filter params and return only filters except for technical fields (example page, size and other)

	const filters = Object.fromEntries(
		Object.entries(params).filter(([key]) => !fieldsToSend.includes(key)),
	);
	const url = applyTransform(
		{
			...params,
			ids: params.ids || ftsIds,
			fields: [
				...(params.fields || []),
				'etag',
				'id',
				'custom',
			],
		},
		[
			merge(getDefaultGetParams()),
			(params) => ({
				...params,
				q: params.search,
				filters: stringifyCaseFilters(filters),
			}),
			sanitize(fieldsToSend),
			camelToSnake(),
			generateUrl(`contacts/${params.parentId}/cases`),
		],
	);

	try {
		const response = await instance.get(url);

		const { items, next } = applyTransform(response.data, [
			merge(getDefaultGetListResponse()),
		]);
		return {
			items: applyTransform(items, [
				snakeToCamel([
					'custom',
				]),
				transformSourceType,
			]),
			next,
		};
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const ContactCasesAPI: ApiModule<Record<string, any>> = {
	getList: getContactCasesList,
};

export default ContactCasesAPI;
