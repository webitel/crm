import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
import CardStoreModule
  from '@webitel/ui-sdk/src/modules/CardStoreModule/store/CardStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';

import SourcesAPI from '../modules/sources/api/SourcesAPI';
import headers from './_internals/headers';
import filters from '../modules/filters/store/filters';

const cardState = {
  itemInstance: {
    id: '',
    name: '',
    description: '',
    type: '',
  },
};

const tableGetters = {
  REQUIRED_FIELDS: () => ['mode'],
};

const api = new ApiStoreModule()
.generateAPIActions(SourcesAPI)
.getModule();

const table = new TableStoreModule({ headers })
.setChildModules({ api, filters })
.getModule({ getters: tableGetters });

const card = new CardStoreModule()
.setChildModules({ api })
.getModule({ state: cardState });

const sources = new BaseStoreModule()
.setChildModules({ table, card })
.getModule();

export default sources;
