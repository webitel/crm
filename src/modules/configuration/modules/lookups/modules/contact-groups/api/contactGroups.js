import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { GroupsApiFactory } from 'webitel-sdk';
import {
  generatePermissionsApi,
} from '@webitel/ui-sdk/src/api/clients/_shared/generatePermissionsApi.js';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const contactGroupsService = new GroupsApiFactory(configuration, '', instance);

const baseUrl = '/contacts/groups';

const fieldsToSend = [
  'name',
  'description',
  'enabled',
  'type',
  'default_group',
];

const getContactGroupsList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'type'];
  const defaultObject = {
    enabled: false,
  };

  const listResponseHandler = (items) => {
    return items.map((item) => {
      if (item.type) {
        item.type = item.type.toLowerCase();
      }
      return item;
    });
  };

  const {
    page,
    size,
    fields,
    sort,
    id,
    q,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  try {
    const response = await contactGroupsService.listGroups(
      page,
      size,
      fields,
      sort,
      id,
      q,
    );
    const { items, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [
        mergeEach(defaultObject),
        listResponseHandler,
      ]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getContactGroup = async ({ itemId: id }) => {
  const itemResponseHandler = (item) => {
    if (item.group.type) {
      item.group.type = item.group.type.toLowerCase();
    }
    return item.group;
  };

  try {
    const response = await contactGroupsService.locateGroup(id, fieldsToSend);
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
  };
};

const addStaticContactGroup = async ({ itemInstance }) => {

  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await contactGroupsService.createGroup(item);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateStaticContactGroup = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  try {
    const response = await contactGroupsService.updateGroup(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchStaticContactGroup = async ({ id, changes }) => {
  const item = applyTransform(changes, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  try {
    const response = await contactGroupsService.updateGroup2(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteStaticContactGroup = async ({ id }) => {
  try {
    const response = await contactGroupsService.deleteGroup(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getLookup = (params) => getContactGroupsList({
  ...params,
  fields: params.fields || ['id', 'name'],
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

};

export default ContactGroupsAPI;
