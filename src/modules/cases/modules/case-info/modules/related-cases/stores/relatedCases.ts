import {createTableStore} from "@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store";

import {CaseRelatedCasesNamespace} from "../namespace";
import {headers} from "./headers/headers";
import {RelatedCasesAPI} from "../api/RelatedCasesAPI";

export const useCaseRelatedCasesStore = createTableStore(CaseRelatedCasesNamespace, {
    apiModule: RelatedCasesAPI,
    headers,
    disablePersistence: true,
});
