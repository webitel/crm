import { createTableStore } from '@webitel/ui-datalist';

import { CommentsAPI } from '../api/CommentsAPI';
import { CaseCommentsNamespace } from '../namespace';
import { headers } from './headers/headers';

export const useCaseCommentsStore = createTableStore(CaseCommentsNamespace, {
  apiModule: CommentsAPI,
  headers,
  disablePersistence: true,
  isAppendDataList: true,
});
