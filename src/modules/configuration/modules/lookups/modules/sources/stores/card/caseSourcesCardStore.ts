import { CaseSourcesAPI } from '@webitel/api-services/api';
import { CreateSourceBody as standardValidationSchema } from '@webitel/api-services/gen';
import { WebitelCasesSource } from '@webitel/api-services/gen';
import { createCardStore } from '@webitel/ui-datalist/card';

import { CaseSourcesNamespace } from "../../namespace";

export const useCaseSourcesCardStore = createCardStore<WebitelCasesSource>({
  namespace: `${CaseSourcesNamespace}/card`,
  apiModule: CaseSourcesAPI,
  standardValidationSchema,
});
