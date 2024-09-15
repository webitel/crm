import { getDefaultGetListResponse, getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import instance from '../../../../../app/api/instance';

const baseUrl = '/objclass';

const getObjectList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const defaultObject = {
    // default object prototype, to merge response with it to get all fields
    class: '',
    obac: false,
    rbac: false,
    id: 0,
  };

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
      items: applyTransform(items, [mergeEach(defaultObject)]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getObject = async ({ itemId: id }) => {
  const url = `${baseUrl}/${id}`;

  try {
    const response = await instance.get(url);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchObject = async ({ changes, id }) => {
  const body = applyTransform(changes, [camelToSnake()]);
  const url = `${baseUrl}/${id}`;
  try {
    const response = await instance.patch(url, body);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const ObjectsAPI = {
  getList: getObjectList,
  get: getObject,
  patch: patchObject,
};

export default ObjectsAPI;
