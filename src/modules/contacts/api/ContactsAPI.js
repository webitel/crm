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
      sort,
      fields,
      id,
      qin,
    );
    const { data, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: data,
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const get = async ({ itemId: id }) => {
  const fields = ['name', 'about', 'labels', 'etag'];
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
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const fieldsToSend = ['name', 'labels', 'about'];

const add = async ({ itemInstance }) => {
  const item = applyTransform(itemInstance, [
    sanitize(fieldsToSend),
    camelToSnake(),
    log,
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
    return applyTransform(response.data, [
      log,
    ]);
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
