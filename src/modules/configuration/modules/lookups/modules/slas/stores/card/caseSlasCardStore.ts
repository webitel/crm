import { SlasAPI } from '@webitel/api-services/api';
import type { WebitelCasesSLA } from '@webitel/api-services/gen/models';
import { slaSchema as standardValidationSchema } from '@webitel/api-services/validations';
import { createCardStore } from '@webitel/ui-datalist/card';

import { SLANamespace } from '../../namespace';

export const useCaseSlasCardStore = createCardStore<WebitelCasesSLA>({
	namespace: `${SLANamespace}/card`,
	apiModule: SlasAPI,
	standardValidationSchema,
});
