import { ServiceCatalogsAPI } from '@webitel/api-services/api';
import type { WebitelCasesCatalog } from '@webitel/api-services/gen/models';
import { caseServiceCatalogSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { ServiceCatalogsNamespace } from '../../namespace';

export const useCaseServiceCatalogsCardStore =
	createCardStore<WebitelCasesCatalog>({
		namespace: `${ServiceCatalogsNamespace}/card`,
		apiModule: ServiceCatalogsAPI,
		standardValidationSchema,
	});
