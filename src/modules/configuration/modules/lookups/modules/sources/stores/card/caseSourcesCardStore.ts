import { CaseSourcesAPI } from '@webitel/api-services/api';
import {
	WebitelCasesSource,
	CreateSourceBody as standardValidationSchema,
} from '@webitel/api-services/gen';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CaseSourcesNamespace } from '../../namespace';

export const useCaseSourcesCardStore = createCardStore<WebitelCasesSource>({
	namespace: `${CaseSourcesNamespace}/card`,
	apiModule: CaseSourcesAPI,
	standardValidationSchema,
});
