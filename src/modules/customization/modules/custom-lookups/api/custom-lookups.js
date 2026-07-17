import {
	DictionariesAPI,
	generatePermissionsApi,
} from '@webitel/api-services/api';

import sortFields from '../../wt-type-extension/utils/sortDynamicField';

const baseUrl = '/types/dictionaries';

const getCustomLookupsList = DictionariesAPI.getTypesList;

const getCustomLookup = async ({ itemId }) => {
	const createPositionGenerator = () => {
		let position = 1;
		return (item) => (item.readonly ? null : position++);
	};
	const getPosition = createPositionGenerator();

	const item = await DictionariesAPI.getType({
		itemId,
	});

	return {
		...item,
		fields: (item.fields || []).map((field) => ({
			...field,
			position: getPosition(field),
		})),
	};
};

const addCustomLookup = DictionariesAPI.addType;

const updateCustomLookup = async ({ itemInstance, itemId }) => {
	const item = sortFields(itemInstance);
	return await DictionariesAPI.updateType({
		itemInstance: item,
		itemId,
	});
};

const deleteCustomLookup = DictionariesAPI.deleteType;

const getCustomLookupLookup = DictionariesAPI.getTypeLookup;

const CustomLookupsApi = {
	getList: getCustomLookupsList,
	get: getCustomLookup,
	add: addCustomLookup,
	update: updateCustomLookup,
	delete: deleteCustomLookup,
	getLookup: getCustomLookupLookup,

	...generatePermissionsApi(baseUrl),
};

export default CustomLookupsApi;
