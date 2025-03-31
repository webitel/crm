import { createTableStore } from '@webitel/ui-sdk/src/modules/Filters/v2/table/createTableStore.store';

import { CommentsAPI } from '../api/CommentsAPI';
import { CaseCommentsNamespace } from '../namespace';
import { headers } from './headers/headers';

export const useCaseCommentsStore = createTableStore(CaseCommentsNamespace, {
  apiModule: CommentsAPI,
  headers,
  disablePersistence: true,
});
