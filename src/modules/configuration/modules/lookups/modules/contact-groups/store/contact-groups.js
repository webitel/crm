import { ContactGroupsAPI } from '@webitel/api-services/api';
import { createObjectPermissionsStoreModule } from '@webitel/ui-sdk/src/modules/ObjectPermissions/store/index';
import {
	createApiStoreModule,
	createBaseStoreModule,
	createCardStoreModule,
} from '@webitel/ui-sdk/store';

const api = createApiStoreModule({
	state: {
		api: ContactGroupsAPI,
	},
});

const permissions = createObjectPermissionsStoreModule({
	modules: {
		table: {
			getters: {
				PARENT_ID: (s, g, rootState) =>
					rootState.configuration.lookups['contact-groups'].card.parentId,
			},
			modules: {
				api,
			},
		},
	},
});

const card = createCardStoreModule({
	state: {
		parentId: null,
	},
	modules: {
		permissions,
	},
});

const contactGroups = createBaseStoreModule({
	modules: {
		card,
	},
});

export default contactGroups;
