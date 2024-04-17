import TableStoreModule
  from '@webitel/ui-sdk/src/modules/TableStoreModule/store/TableStoreModule';
import ApiStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/ApiStoreModule';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import filters from '../modules/filters/store/filters';
import headers from './_internals/headers';
import TimelineAPI from '../api/TimelineAPI';

const getters = {
  PARENT_ID: (state, getters, rootState) => rootState.contacts.card.itemId,
};

const api = new ApiStoreModule()
.generateAPIActions(TimelineAPI)
.getModule();

const table = new TableStoreModule({ headers })
.setChildModules({ api, filters })
.getModule({getters});


const timeline = new BaseStoreModule()
.setChildModules({table})
.getModule();

export default timeline;
