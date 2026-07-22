import { ContactGroupsAPI, DynamicGroupsAPI } from '@webitel/api-services/api';
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import { contactGroupSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';
import { useRoute } from 'vue-router';

import { ContactGroupsNamespace } from '../../namespace';

const wrappedApiModule = {
	...ContactGroupsAPI,
	add: async (params) => {
		if (params?.itemInstance?.type === ContactsGroupType.Dynamic) {
			return DynamicGroupsAPI.add(params);
		}

		return ContactGroupsAPI.add(params);
	},
	update: async (params) => {
		if (params?.itemInstance?.type === ContactsGroupType.Dynamic) {
			return DynamicGroupsAPI.update(params);
		}

		return ContactGroupsAPI.update(params);
	},
};

const useBaseContactGroupsCardStore = createCardStore({
	namespace: `${ContactGroupsNamespace}/card`,
	apiModule: wrappedApiModule,
	standardValidationSchema,
});

const getInitialGroupType = () => {
	const route = useRoute();

	return route.params.id === 'new'
		? (route.query.type?.toString().toUpperCase() as ContactsGroupType)
		: null;
};

export const createContactGroupsCardStoreWrapper =
	(): typeof useBaseContactGroupsCardStore => {
		const wrappedUseContactGroupsCardStore = () => {
			const store = useBaseContactGroupsCardStore();
			const initialType = getInitialGroupType();
			const draftItemInstance = store.draftItemInstance;

			if (initialType && !draftItemInstance?.type) {
				store.draftItemInstance = {
					...draftItemInstance,
					type: initialType,
				};
			}

			return store;
		};

		return Object.assign(
			wrappedUseContactGroupsCardStore,
			useBaseContactGroupsCardStore,
		);
	};

export const useContactGroupsCardStore = createContactGroupsCardStoreWrapper();
