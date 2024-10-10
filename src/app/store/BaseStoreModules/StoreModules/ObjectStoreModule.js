import BaseStoreModule from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import deepCopy from 'deep-copy';

const baseState = {
  headers: [],
  dataList: [],
  aggs: {},
  size: 10,
  search: '',
  page: 1,
  sort: '',
  isNextPage: false,
};

export default class ObjectStoreModule extends BaseStoreModule {
  constructor({ resettableState = {}, headers = [] } = {}) {
    super();

    this._resettableState = () =>
      deepCopy({
        ...baseState,
        ...resettableState,
      });

    this.state = {
      headers,
      ...this._resettableState(),
    };
  }
}

