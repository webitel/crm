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

const defaultFields = [
  {
    id: 'name',
    kind: 'string',
    name: 'Name',
    required: true,
  },
  {
    default: '$(nextval)',
    id: 'id',
    name: 'Id',
    kind: 'int64',
    readonly: true,
    required: true,
  },
  {
    id: 'created_at',
    name: 'Created on',
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
    name: 'Created by',
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
    name: 'Modified on',
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
    name: 'Modified by',
    kind: 'lookup',
    lookup: {
      type: 'users',
    },
    always: '$(user)',
    readonly: true,
  },
  {
    id: 'customDate',
    name: 'Custom Date on',
    kind: 'datetime',
  },
  {
    id: 'description',
    name: 'Description',
    kind: 'string',
  },
];

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    repo: '',
    description: '',
    administered: false,
    primary: 'id',
    display: 'name',
    fields: deepCopy(defaultFields),
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
