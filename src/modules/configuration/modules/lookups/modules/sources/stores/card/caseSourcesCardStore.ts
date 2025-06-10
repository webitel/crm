import {createSourceBody as standardValidationSchema} from "@webitel/api-services/gen";
import { WebitelCasesSource } from "@webitel/api-services/gen";
import {createCardStore} from "@webitel/ui-datalist/card";

import CaseSourcesAPI from "../../api/caseSources";
import { CaseSourcesNamespace } from "../../namespace";

export const useCaseSourcesCardStore = createCardStore<WebitelCasesSource>({
  namespace: `${CaseSourcesNamespace}/card`,
  apiModule: CaseSourcesAPI,
  standardValidationSchema,
});
