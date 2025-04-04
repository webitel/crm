import { generatePermissionsApi } from '@webitel/ui-sdk/src/api/clients/_shared/generatePermissionsApi.js';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { DictionariesApiFactory } from 'webitel-sdk';

import sortFields from '../../wt-type-extension/utils/sortDynamicField';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const baseUrl = '/types/dictionaries';

const dictionariesService = new DictionariesApiFactory(
  configuration,
  '',
  instance,
);

const fieldsToSend = [
  'name',
  'about',
  'dictionary',
  'fields',
  'repo',
  'administered',
  'primary',
  'display',
];

const getCustomLookupsList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const { page, size, fields, sort, id, q } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await dictionariesService.searchType(
      q,
      id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      size,
      page,
      sort,
      fields,
    );
    const { data, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);

    const itemResponseHandler = (items) =>
      (items || []).map((item) => ({
        ...item,
        id: item.repo,
      }));

    return {
      items: applyTransform(data, [snakeToCamel(), itemResponseHandler]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getCustomLookup = async ({ itemId: itemRepo }) => {
  const createPositionGenerator = () => {
    let position = 1;
    return (item) => (item.readonly ? null : position++);
  };
  const getPosition = createPositionGenerator();

  const itemResponseHandler = (item) => ({
    ...item,
    id: item.repo,
    fields: item.fields.map((field) => ({
      ...field,
      position: getPosition(field),
    })),
  });

  try {
    const response = await dictionariesService.locateType(
      itemRepo,
      fieldsToSend,
    );

    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const itemResponseHandler = (item) => ({
  ...item,
  id: item.repo,
});

const addCustomLookup = async ({ itemInstance }) => {
  const repo = itemInstance.repo;
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await dictionariesService.createType(repo, item);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCustomLookup = async ({ itemInstance, itemId: id }) => {
  const repo = id;

  const item = applyTransform(itemInstance, [
    sortFields,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await dictionariesService.updateType(repo, item);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteCustomLookup = async ({ id }) => {
  try {
    const response = await dictionariesService.deleteType(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getCustomLookupLookup = async (params) =>
  getCustomLookupsList({
    ...params,
    fields: params.fields || ['id', 'name'],
  });

const CustomLookupsApi = {
  getList: getCustomLookupsList,
  get: getCustomLookup,
  add: addCustomLookup,
  update: updateCustomLookup,
  delete: deleteCustomLookup,
  getLookup: getCustomLookupLookup,

  ...generatePermissionsApi(baseUrl),
};

export default CustomLookupsApi;
