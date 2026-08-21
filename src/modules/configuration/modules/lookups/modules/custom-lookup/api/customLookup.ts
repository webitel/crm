import { AdjunctTypeRecordsAPI } from '@webitel/api-services/api';
import { computed } from 'vue';

import { customLookupFields } from '../stores/_internals/customLookupFields';

// AdjunctTypeRecordsAPI's getList/get/add/update/delete already speak
// createCardStore/createTableStore's language directly (parentId/itemId/
// itemInstance) — only add/update need wrapping here, to sanitize
// itemInstance against the CURRENTLY OPEN dictionary's dynamic field list,
// which the raw client can't know about (crm-local runtime state, not a
// generic API concern).
const fieldsToSend = computed(() =>
	customLookupFields.value
		.filter((field) => !field.hidden && !field.always)
		.map((field) => field.id),
);

export const CustomLookupAPI = {
	...AdjunctTypeRecordsAPI,
	add: (params: Parameters<typeof AdjunctTypeRecordsAPI.add>[0]) =>
		AdjunctTypeRecordsAPI.add({
			...params,
			fieldsToSend: fieldsToSend.value,
		}),
	update: (params: Parameters<typeof AdjunctTypeRecordsAPI.update>[0]) =>
		AdjunctTypeRecordsAPI.update({
			...params,
			fieldsToSend: fieldsToSend.value,
		}),
};
