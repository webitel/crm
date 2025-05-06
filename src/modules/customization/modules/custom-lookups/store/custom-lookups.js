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
    name: 'customization.customLookups.field.name',
    required: true,
  },
  {
    default: '$(nextval)',
    id: 'id',
    name: 'customization.customLookups.field.id',
    kind: 'int64',
    readonly: true,
    required: true,
  },
  {
    id: 'created_at',
    name: 'customization.customLookups.field.createdAt',
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
    name: 'customization.customLookups.field.createdBy',
    kind: 'lookup',
    lookup: {
      path: 'users',
    },
    default: '$(user)',
    readonly: true,
  },
  {
    id: 'updated_at',
    name: 'customization.customLookups.field.modifiedAt',
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
    name: 'customization.customLookups.field.modifiedBy',
    kind: 'lookup',
    lookup: {
      path: 'users',
    },
    always: '$(user)',
    readonly: true,
  },
  {
    id: 'description',
    name: 'vocabulary.description',
    kind: 'string',
  },
];

const resetCardState = {
  itemId: '',
  itemInstance: {
    name: '',
    repo: '',
    about: '',
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
