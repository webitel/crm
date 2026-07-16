import { DictionariesAPI } from '@webitel/api-services/api';

const CustomLookupApi = {
	getList: DictionariesAPI.getList,
	get: DictionariesAPI.get,
	add: DictionariesAPI.add,
	update: DictionariesAPI.update,
	delete: DictionariesAPI.delete,
	getLookup: DictionariesAPI.getLookup,
	batchCreate: DictionariesAPI.batchCreate,
};

export default CustomLookupApi;
