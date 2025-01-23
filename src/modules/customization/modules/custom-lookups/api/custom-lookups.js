import { generatePermissionsApi } from '@webitel/ui-sdk/src/api/clients/_shared/generatePermissionsApi.js';
import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();

const baseUrl = '/types/dictionaries';

const getCustomLookupsList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
    generateUrl(baseUrl),
  ]);
  try {
    const response = await instance.get(url);
    const { data, next } = applyTransform(response.data, [
      snakeToCamel(),
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

const CustomLookupsApi = {
  getList: getCustomLookupsList,

  ...generatePermissionsApi(baseUrl),
};

export default CustomLookupsApi;
