import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/api-services/api/defaults';
import { applyTransform,
  camelToSnake,
  generateUrl,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/api-services/api/transformers';

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
    throw applyTransform(err, [notify]);
  }
};

const RolesAPI = {
  getList,
};

export default RolesAPI;
