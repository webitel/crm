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

const instance = getDefaultInstance();

const baseUrl = '/contacts/groups';

const fieldsToSend = ['name', 'description', 'enabled'];

const getContactGroupsList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields'];

  const defaultObject = {
    enabled: false,
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
      items: applyTransform(items, [mergeEach(defaultObject)]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getContactGroup = async ({ itemId: id }) => {
  const itemResponseHandler = (item) => {
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

// const preRequestHandler = (item) => {
//   return {
//     ...item,
//     calendarId: item.calendar.id,
//   }
// };

const addStaticContactGroup = async ({ itemInstance }) => {

  const item = applyTransform(itemInstance, [
    // preRequestHandler,
    sanitize(fieldsToSend),
    camelToSnake(),
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

const ContactGroupsAPI = {
  getList: getContactGroupsList,
  get: getContactGroup,
  add: addStaticContactGroup,
  update: updateStaticContactGroup,
  patch: patchStaticContactGroup,
  delete: deleteStaticContactGroup,
}

export default ContactGroupsAPI;
