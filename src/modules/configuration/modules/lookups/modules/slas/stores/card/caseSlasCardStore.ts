import { SlasAPI } from '@webitel/api-services/api';
import {
	CreateSLABody as standardValidationSchema,
	WebitelCasesSLA,
} from '@webitel/api-services/gen';
import { createCardStore } from '@webitel/ui-datalist/card';

import { SLANamespace } from '../../namespace';

export const useCaseSlasCardStore = createCardStore<WebitelCasesSLA>({
	namespace: `${SLANamespace}/card`,
	apiModule: SlasAPI,
	standardValidationSchema,
});
