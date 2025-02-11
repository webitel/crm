import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { DictionariesApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const dictionariesService = new DictionariesApiFactory(
  configuration,
  '',
  instance,
);

const fieldsToSend = [
  'name',
  'description',
  'dictionary',
  'fields',
  'repo',
  'administered',
  'primary',
  'display',
];

const getCustomLookupRecords = async ({ repo, ...params }) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const { page, size, fields, sort, id, q } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await dictionariesService.searchData(
      repo,
      size,
      page,
      sort,
      fields,
      q,
      id,
    );
    const { data, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(data, []),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getCustomLookupRecord = async ({ itemId: id, repo }) => {
  try {
    const response = await dictionariesService.locateData(
      repo,
      id,
      fieldsToSend,
    );
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const addCustomLookupRecord = async ({ itemInstance, repo }) => {
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await dictionariesService.createData(repo, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCustomLookupRecord = async ({ itemInstance, itemId: id, repo }) => {
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await dictionariesService.updateData(repo, id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const prettierData = (data) => {
  return data?.map((item) => ({ ...item, id: item.repo }));
};

const getCustomLookupLookup = async ({ type, ...params }) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
    generateUrl(type),
  ]);
  try {
    const response = await instance.get(url);
    const { data, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);

    return {
      items: applyTransform(data, [prettierData]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const CustomLookupApi = {
  getList: getCustomLookupRecords,
  get: getCustomLookupRecord,
  add: addCustomLookupRecord,
  update: updateCustomLookupRecord,
  getLookup: getCustomLookupLookup,
};

export default CustomLookupApi;
