import { getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { IMClientsApiFactory } from 'webitel-sdk';

import getDefaultGetListResponse from '../../../../../app/api/defaults/getDefaultGetListResponse';
import instance from '../../../../../app/api/instance';
import configuration from '../../../../../app/api/openAPIConfig';

const service = new IMClientsApiFactory(configuration, '', instance);

const getList = async (params) => {
  const { parentId, page, size, q, sort, id } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('q'),
  ]);
  try {
    const response = await service.listIMClients(
      parentId,
      page,
      size,
      q,
      sort,
      id,
    );
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

const deleteItem = async ({ id, parentId }) => {
  try {
    const response = await service.deleteIMClient(parentId, id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

export default {
  getList,
  delete: deleteItem,
};
