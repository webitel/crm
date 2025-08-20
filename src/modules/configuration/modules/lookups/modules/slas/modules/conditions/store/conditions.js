import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import applyTransform, {
  notify,
} from '@webitel/ui-sdk/src/api/transformers/index';

import i18n from '../../../../../../../../../app/locale/i18n.js';

const { t } = i18n.global;

import ConditionsAPI from '../api/conditions.js';
import filters from '../modules/filters/store/filters.js';
import { headers } from './_internals/headers.ts';

const resetCardState = {
  itemId: '',
  itemInstance: {
    id: '',
    name: '',
    priorities: [],
    reactionTime: 0,
    resolutionTime: 0,
    slaId: 0,
  },
};

const getters = {
  PARENT_ID: (s, g, rootState) =>
    rootState.configuration.lookups.slas.card.itemId,
};

const actions = {
  ADD_ITEM: async (context) => {
    try {
      await context.dispatch('api/POST_ITEM', { context });
    } catch (err) {
      throw applyTransform(err, [
        notify(({ callback }) =>
          callback({
            type: 'error',
            text:
              err.response.data.code === 400
                ? t('lookups.slas.error.duplicateConditionName')
                : err.response?.data?.detail,
          }),
        ),
      ]);
    }
  },
  UPDATE_ITEM: async (context) => {
    await context.dispatch('api/UPD_ITEM', { context });
  },
};

const api = createApiStoreModule({
  state: {
    api: ConditionsAPI,
  },
});

const table = createTableStoreModule({
  state: {
    headers,
  },
  getters,
  modules: {
    api,
    filters,
  },
});

const card = createCardStoreModule({
  state: { _resettable: resetCardState },
  getters,
  actions,
  modules: {
    api,
  },
});

const conditions = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default conditions;
