import { CaseSourcesAPI } from '@webitel/api-services/api';
import type { WebitelCasesSource } from '@webitel/api-services/gen';
import { caseSourceSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CaseSourcesNamespace } from '../../namespace';

export const useCaseSourcesCardStore = createCardStore<WebitelCasesSource>({
	namespace: `${CaseSourcesNamespace}/card`,
	apiModule: CaseSourcesAPI,
	standardValidationSchema,
});
