import {
	getDefaultGetListResponse,
	getDefaultGetParams,
	getDefaultInstance,
	getDefaultOpenAPIConfig,
} from '@webitel/api-services/api/defaults';
import {
	applyTransform,
	camelToSnake,
	merge,
	notify,
	sanitize,
	snakeToCamel,
	starToSearch,
} from '@webitel/api-services/api/transformers';
import { DynamicConditionsApiFactory } from 'webitel-sdk';

import i18n from '../../../../../../../../../app/locale/i18n.js';

const { t } = i18n.global;

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const dynamicGroupConditionsService = new DynamicConditionsApiFactory(
	configuration,
	'',
	instance,
);

const fieldsToSend = [
	'assignee',
	'expression',
	'group',
];

const getConditionsList = async ({ parentId, ...rest }) => {
	const fieldsToSend = [
		'page',
		'size',
		'q',
		'sort',
		'fields',
		'id',
	];

	const { page, size, fields, sort, id, q } = applyTransform(rest, [
		merge(getDefaultGetParams()),
		starToSearch('search'),
		(params) => ({
			...params,
			q: params.search,
		}),
		sanitize(fieldsToSend),
		camelToSnake(),
	]);
	try {
		const response = await dynamicGroupConditionsService.listConditions(
			parentId,
			page,
			size,
			fields,
			sort,
			id,
			q,
		);
		const { items, next } = applyTransform(response.data, [
			merge(getDefaultGetListResponse()),
		]);
		return {
			items: applyTransform(items, [
				snakeToCamel(),
			]),
			next,
		};
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const getCondition = async ({ itemId: id }) => {
	const itemResponseHandler = (item) => {
		return item.condition;
	};

	try {
		const response = await dynamicGroupConditionsService.locateCondition(
			id,
			fieldsToSend,
		);
		return applyTransform(response.data, [
			snakeToCamel(),
			itemResponseHandler,
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const updateCondition = async ({ itemInstance, itemId: id }) => {
	const item = applyTransform(itemInstance, [
		camelToSnake(),
		sanitize(fieldsToSend),
	]);

	try {
		const response = await dynamicGroupConditionsService.updateCondition(
			id,
			item,
		);
		return applyTransform(response.data, [
			snakeToCamel(),
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify(({ callback }) =>
				callback({
					type: 'error',
					text:
						err.response.data.code === 409
							? t('lookups.closeReasonGroups.sameConditionError')
							: err.response?.data?.detail,
				}),
			),
		]);
	}
};

const addCondition = async ({ itemInstance, parentId }) => {
	const item = applyTransform(itemInstance, [
		camelToSnake(),
		sanitize(fieldsToSend),
	]);

	try {
		const response = await dynamicGroupConditionsService.createCondition(
			parentId,
			item,
		);
		return applyTransform(response.data, [
			snakeToCamel(),
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify(({ callback }) =>
				callback({
					type: 'error',
					text:
						err.response.data.code === 409
							? t('lookups.closeReasonGroups.sameConditionError')
							: err.response?.data?.detail,
				}),
			),
		]);
	}
};

const patchCondition = async ({ parentId, changes }) => {
	const item = applyTransform(changes, [
		camelToSnake(),
	]);

	try {
		const response = await dynamicGroupConditionsService.updateCondition2(
			parentId,
			item,
		);
		return applyTransform(response.data, []);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const deleteCondition = async ({ id }) => {
	try {
		const response = await dynamicGroupConditionsService.deleteCondition(id);
		return applyTransform(response.data, []);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const ConditionsAPI = {
	getList: getConditionsList,
	get: getCondition,
	update: updateCondition,
	patch: patchCondition,
	delete: deleteCondition,
	add: addCondition,
};

export default ConditionsAPI;
