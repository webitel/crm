import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
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

import { generatePermissionsApi } from '@webitel/ui-sdk/src/api/clients/_shared/generatePermissionsApi.js';

const instance = getDefaultInstance();

const baseUrl = '/contacts/groups';

const fieldsToSend = ['name', 'description', 'enabled', 'type'];

const getContactGroupsList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'type'];
  const defaultObject = {
    enabled: false,
  };

  const listResponseHandler = (items) => {
    return items.map((item) => ({
      ...item,
      type: item.type.toLowerCase(),
    }));
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
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [mergeEach(defaultObject), listResponseHandler]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getContactGroup = async ({ itemId: id }) => {
  const itemResponseHandler = (item) => {
    if(item.group.type) {
      item.group.type = item.group.type.toLowerCase();
    }
    return item.group;
  };

  const url = applyTransform({ fields: fieldsToSend }, [
    generateUrl(`${baseUrl}/${id}`),
  ]);

  try {
    const response = await instance.get(url);
    return applyTransform(response.data, [
      snakeToCamel(),
      itemResponseHandler,
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const preRequestHandler = (item) => {
  return {
    ...item,
    type: item.type.toUpperCase(),
  }
};

const addStaticContactGroup = async ({ itemInstance }) => {

  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await instance.post(baseUrl, item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateStaticContactGroup = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [camelToSnake(), sanitize(fieldsToSend)]);

  const url = `${baseUrl}/${id}`;
  try {
    const response = await instance.put(url, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchStaticContactGroup = async ({ id, changes }) => {
  const item = applyTransform(changes, [camelToSnake(), sanitize(fieldsToSend)]);
  console.log(changes)
  console.log(item)

  const url = `${baseUrl}/${id}`;
  try {
    const response = await instance.patch(url, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteStaticContactGroup = async ({ id }) => {
  const url = `${baseUrl}/${id}`;
  try {
    const response = await instance.delete(url);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getLookup = (params) => getContactGroupsList({
  ...params,
  fields: params.fields || ['id', 'name', 'type'],
});

const ContactGroupsAPI = {
  getList: getContactGroupsList,
  get: getContactGroup,
  add: addStaticContactGroup,
  update: updateStaticContactGroup,
  patch: patchStaticContactGroup,
  delete: deleteStaticContactGroup,
  getLookup,

  ...generatePermissionsApi(baseUrl),
}

export default ContactGroupsAPI;
