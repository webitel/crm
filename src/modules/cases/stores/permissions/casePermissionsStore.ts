import { CasesAPI } from '@webitel/api-services/api';
import { createPermissionsStore } from '@webitel/ui-datalist/permissions-page';

import { CasesNamespace } from '../../namespace';

export const useCasePermissionsStore = createPermissionsStore(
	`${CasesNamespace}/permissions`,
	{
		apiModule: CasesAPI,
	},
);
