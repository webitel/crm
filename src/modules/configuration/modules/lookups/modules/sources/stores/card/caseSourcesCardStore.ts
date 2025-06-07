import {createSourceBody as standardValidationSchema} from "@webitel/api-services/gen";
import {createCardStore} from "@webitel/ui-datalist/card";

import CaseSourcesAPI from "../../api/caseSources";
import { CaseSourcesNamespace } from "../../namespace";

export const useCaseSourcesFormStore = createCardStore({
  namespace: `${CaseSourcesNamespace}/form`,
  apiModule: CaseSourcesAPI,
  standardValidationSchema,
});
