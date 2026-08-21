import { ServicesAPI } from '@webitel/api-services/api';
import type { WebitelCasesService } from '@webitel/api-services/gen/models';
import { caseServiceSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CatalogServicesNamespace } from '../../namespace';

export const useCaseServicesCardStore = createCardStore<WebitelCasesService>({
	namespace: `${CatalogServicesNamespace}/card`,
	apiModule: ServicesAPI,
	standardValidationSchema,
});
