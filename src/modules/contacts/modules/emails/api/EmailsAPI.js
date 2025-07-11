import {
  getDefaultGetParams,
} from '@webitel/api-services/api/defaults';
import { applyTransform,
  camelToSnake,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/api-services/api/transformers';
import { EmailsApiFactory } from 'webitel-sdk';

import getDefaultGetListResponse from '../../../../../app/api/defaults/getDefaultGetListResponse';
import instance from '../../../../../app/api/instance';
import configuration from '../../../../../app/api/openAPIConfig';

const service = new EmailsApiFactory(configuration, '', instance);

const getList = async (params) => {
  const defaultObject = {
    primary: false,
  };

  const fieldsToSend = [
    'parentId',
    'page',
    'size',
    'q',
    'sort',
    'fields',
    'id',
  ];
  const { parentId, page, size, q, sort, fields, id } = applyTransform(params, [
    sanitize(fieldsToSend),
    merge(getDefaultGetParams()),
    starToSearch('q'),
  ]);
  try {
    const response = await service.listEmails(
      parentId,
      page,
      size,
      q,
      sort,
      ['etag', ...fields],
      id,
    );
    const { data, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(data, [mergeEach(defaultObject)]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const get = async ({ itemId, parentId }) => {
  const fields = ['email', 'primary', 'etag', 'type'];
  try {
    const response = await service.locateEmail(parentId, itemId, fields);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const fieldsToSend = ['email', 'type', 'primary'];

const add = async ({ parentId, itemInstance }) => {
  const item = applyTransform(itemInstance, [
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await service.mergeEmails(parentId, [item]);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};
const update = async ({ itemInstance, etag: id, parentId }) => {
  const item = applyTransform(itemInstance, [
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await service.updateEmail(parentId, id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patch = async ({ parentId, changes, etag }) => {
  const body = applyTransform(changes, [
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await service.updateEmail(parentId, etag, body);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteItem = async ({ id, etag, parentId }) => {
  try {
    const response = await service.deleteEmail(parentId, etag);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

export default {
  getList,
  get,
  add,
  update,
  patch,
  delete: deleteItem,
};
