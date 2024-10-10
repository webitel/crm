import BaseStoreModule from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import deepCopy from 'deep-copy';

export default class ObjectStoreModule extends BaseStoreModule {
  constructor({ resettableState, headers } = {}) {
    super();
    this._resettableState = () =>
      deepCopy({
        ...resettableState,
      });
    this.state = {
      headers,
      ...this._resettableState(),
    };
  }
}
