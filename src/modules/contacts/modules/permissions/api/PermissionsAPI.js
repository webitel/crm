import {
	getDefaultGetListResponse,
	getDefaultGetParams,
} from '@webitel/api-services/api/defaults';
import {
	applyTransform,
	camelToSnake,
	generateUrl,
	log,
	merge,
	notify,
	sanitize,
	snakeToCamel,
	starToSearch,
} from '@webitel/api-services/api/transformers';

import instance from '../../../../../app/api/instance';

const baseUrl = '/contacts';

const getList = async (params) => {
	const fieldsToSend = [
		'page',
		'size',
		'q',
		'sort',
		'id',
	];

	const listResponseHandler = (items) =>
		items.map((item) => ({
			...item,
			access: {
				x: {
					id: (item.granted.match(/x/g) || []).length + 1,
					rule: 'x'.repeat((item.granted.match(/x/g) || []).length),
				},
				r: {
					id: (item.granted.match(/r/g) || []).length + 1,
					rule: 'r'.repeat((item.granted.match(/r/g) || []).length),
				},
				w: {
					id: (item.granted.match(/w/g) || []).length + 1,
					rule: 'w'.repeat((item.granted.match(/w/g) || []).length),
				},
				d: {
					id: (item.granted.match(/d/g) || []).length + 1,
					rule: 'd'.repeat((item.granted.match(/d/g) || []).length),
				},
			},
		}));

	const url = applyTransform(params, [
		merge(getDefaultGetParams()),
		starToSearch('search'),
		(params) => ({
			...params,
			q: params.search,
		}),
		sanitize(fieldsToSend),
		camelToSnake(),
		generateUrl(`${baseUrl}/${params.parentId}/acl`),
	]);
	try {
		const response = await instance.get(url);
		const { items, next } = applyTransform(response.data, [
			snakeToCamel(),
			merge(getDefaultGetListResponse()),
		]);
		return {
			items: applyTransform(items, [
				listResponseHandler,
			]),
			next,
		};
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const patch = async ({ changes, id, parentId }) => {
	const body = applyTransform(changes, [
		camelToSnake(),
	]);
	let url = `contacts/${parentId}/acl`;
	if (id) url += `/${id}`;
	try {
		const response = await instance.patch(url, body);
		return applyTransform(response.data, [
			snakeToCamel(),
			log,
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const PermissionsAPI = {
	getList,
	patch,
};

export default PermissionsAPI;
