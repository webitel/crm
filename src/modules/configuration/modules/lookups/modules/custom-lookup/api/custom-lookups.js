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
import deepCopy from 'deep-copy';
import { DictionariesApiFactory } from 'webitel-sdk';

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
  'description',
  'dictionary',
  'fields',
  'repo',
  'administered',
  'primary',
  'display',
];

const getCustomLookupList = async ({ repo, ...params }) => {
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

const CustomLookupApi = {
  getList: getCustomLookupList,

  ...generatePermissionsApi(baseUrl),
};

export default CustomLookupApi;
