import {
  createApiStoreModule,
  createBaseStoreModule,
  createCardStoreModule,
  createTableStoreModule,
} from '@webitel/ui-sdk/store';
import deepCopy from 'deep-copy';

import CustomLookupsApi from '../api/custom-lookups.js';
import filters from '../modules/filters/store/filters';
import headers from './_internals/headers';

const defaultColumns = [
  {
    default: '$(nextval)',
    id: 'id',
    kind: 'int64',
    readonly: true,
    required: true,
  },
  {
    id: 'name',
    kind: 'string',
    name: 'Name',
    required: true,
  },
  {
    id: 'created_at',
    name: 'Creation Date',
    kind: 'datetime',
    datetime: {
      part: 'full',
      time: 's',
    },
    default: '$(timestamp)',
    readonly: true,
  },
  {
    id: 'created_by',
    name: 'Author',
    kind: 'lookup',
    lookup: {
      id: 'id',
      name: 'name',
      type: 'users',
    },
    default: '$(user)',
    readonly: true,
  },
  {
    id: 'updated_at',
    name: 'Last Modified',
    kind: 'datetime',
    datetime: {
      part: 'full',
      time: 's',
    },
    always: '$(timestamp)',
    readonly: true,
  },
  {
    id: 'updated_by',
    name: 'Editor',
    kind: 'lookup',
    lookup: {
      type: 'users',
    },
    always: '$(user)',
    readonly: true,
  },
];

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    repo: '',
    description: '',
    controlPermissions: false,
    primary: 'id',
    display: 'name',
    columns: deepCopy(defaultColumns),
  },
};

const api = createApiStoreModule({
  state: {
    api: CustomLookupsApi,
  },
});

const table = createTableStoreModule({
  state: { headers },
  modules: {
    filters,
    api,
  },
});

const card = createCardStoreModule({
  state: {
    itemInstance: resetCardState.itemInstance,
    _resettable: resetCardState,
  },
  modules: {
    api,
  },
});

const customLookups = createBaseStoreModule({
  modules: {
    table,
    card,
  },
});

export default customLookups;
