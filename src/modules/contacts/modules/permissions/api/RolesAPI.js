import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge, notify, snakeToCamel,
  starToSearch, log, sanitize,
  generateUrl, mergeEach,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import instance from '../../../../../app/api/instance';

const baseUrl = '/roles';

const getList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'fields', 'id'];

  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
    generateUrl(baseUrl),
  ]);
  try {
    const response = await instance.get(url);
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items,
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const RolesAPI = {
  getList,
};

export default RolesAPI;
