import {
	getDefaultInstance,
	getDefaultOpenAPIConfig,
} from '@webitel/api-services/api/defaults';
import {
	applyTransform,
	camelToSnake,
	notify,
	sanitize,
	snakeToCamel,
} from '@webitel/api-services/api/transformers';
import { DynamicGroupsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const dynamicContactGroupsService = new DynamicGroupsApiFactory(
	configuration,
	'',
	instance,
);

const fieldsToSend = [
	'name',
	'description',
	'enabled',
	'type',
	'default_group',
];

const addDynamicContactGroup = async (itemInstance) => {
	const item = applyTransform(itemInstance, [
		camelToSnake(),
		sanitize(fieldsToSend),
	]);

	try {
		const response = await dynamicContactGroupsService.createDynamicGroup(item);
		return applyTransform(response.data, [
			snakeToCamel(),
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const updateDynamicContactGroup = async ({ itemInstance, itemId: id }) => {
	const item = applyTransform(itemInstance, [
		camelToSnake(),
		sanitize(fieldsToSend),
	]);

	try {
		const response = await dynamicContactGroupsService.updateDynamicGroup(
			id,
			item,
		);
		return applyTransform(response.data, [
			snakeToCamel(),
		]);
	} catch (err) {
		throw applyTransform(err, [
			notify,
		]);
	}
};

const dynamicContactGroupsAPI = {
	add: addDynamicContactGroup,
	update: updateDynamicContactGroup,
};

export default dynamicContactGroupsAPI;
