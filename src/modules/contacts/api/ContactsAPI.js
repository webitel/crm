import applyTransform, {
  log,
  merge,
  starToSearch,
  camelToSnake,
  snakeToCamel,

  notify,
  sanitize,
} from '@webitel/ui-sdk/src/api/transformers';
import {
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
import { ContactsApiFactory } from 'webitel-sdk';
import getDefaultGetListResponse
  from '../../../app/api/defaults/getDefaultGetListResponse';
import configuration from '../../../app/api/openAPIConfig';
import instance from '../../../app/api/instance';
import SearchMode from '../modules/filters/enums/SearchMode.enum';

const service = new ContactsApiFactory(configuration, '', instance);

const formatAccessMode = (item) => ({
  ...item,
  access: {
    edit: item.mode.includes('w'),
    delete: item.mode.includes('d'),
  },
});

const getList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id', 'qin'];
  let searchValue = '';
  let searchKey = '';

  if (params[SearchMode.NAME]) {
    searchValue = params[SearchMode.NAME];
    searchKey = SearchMode.NAME;
  } else if (params[SearchMode.LABELS]) {
    searchValue = params[SearchMode.LABELS];
    searchKey = SearchMode.LABELS;
  } else if (params[SearchMode.ABOUT]) {
    searchValue = params[SearchMode.ABOUT];
    searchKey = SearchMode.ABOUT;
  }

  const changedParams = {
    ...params,
    q: searchValue,
    qin: searchKey,
  };

  const {
    page,
    size,
    q,
    sort,
    fields,
    id,
    qin,
  } = applyTransform(changedParams, [
    sanitize(fieldsToSend),
    merge(getDefaultGetParams()),
    starToSearch('q'),
    camelToSnake(),
  ]);
  try {
    const response = await service.searchContacts(
      page,
      size,
      q,
      sort || '+name',
      fields,
      id,
      qin,
    );
    const { data, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(data, [
        (items) => items.map((item) => formatAccessMode(item)),
      ]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const get = async ({ itemId: id }) => {
  const fields = ['name', 'about', 'labels', 'etag', 'mode', 'managers', 'timezones'];

  const defaultObject = {};
  const itemResponseHandler = (item) => {
    return {
      ...item,
      labels: item.labels?.data || [],
      managers: item.managers?.data || [],
      timezones: item.timezones?.data || [],
    };
  };
  try {
    const response = await service.locateContact(id, fields);
    return applyTransform(response.data, [
      snakeToCamel(),
      merge(defaultObject),
      itemResponseHandler,
      formatAccessMode,
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const fieldsToSend = ['name', 'labels', 'about', 'managers', 'timezones'];

const sanitizeManagers = (itemInstance) => {
  // handle many managers and even no managers field cases
  const managers = (itemInstance.managers ||
    []).filter(({ user } = {}) => user.id);
  return { ...itemInstance, managers };
};

const sanitizeTimezones = (itemInstance) => {
  // handle many timezones and even no timezones field cases
  const timezones = (itemInstance.timezones ||
    []).filter(({ timezone } = {}) => timezone.id);
  return { ...itemInstance, timezones };
};

const add = async ({ itemInstance }) => {
  const item = applyTransform(itemInstance, [
    sanitizeManagers,
    sanitizeTimezones,
    sanitize(fieldsToSend),
    camelToSnake(),

  ]);
  try {
    const response = await service.createContact(item);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const update = async ({ itemInstance }) => {
  const { etag } = itemInstance;
  const item = applyTransform(itemInstance, [
    sanitizeManagers,
    sanitizeTimezones,
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await service.updateContact(etag, item);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const deleteContact = async ({ id }) => {
  try {
    const response = await service.deleteContact(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

export default {
  getList,
  get,
  add,
  update,
  delete: deleteContact,
};
