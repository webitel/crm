import { createTableStore } from '@webitel/ui-datalist';

import { RelatedCasesAPI } from '../api/RelatedCasesAPI';
import { CaseRelatedCasesNamespace } from '../namespace';
import { headers } from './headers/headers';

export const useCaseRelatedCasesStore = createTableStore(
  CaseRelatedCasesNamespace,
  {
    apiModule: RelatedCasesAPI,
    headers,
    disablePersistence: true,
  },
);
