import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { SourcesApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const sourceService = new SourcesApiFactory(configuration, '', instance);

const fieldsToSend = ['name', 'description', 'type'];

const getSourcesList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const listResponseHandler = (items) => {
    return items.map((item) => ({
      ...item,
      type: item.type.toLowerCase(),
    }));
  };

  const {
    page,
    size,
    fields,
    sort,
    id,
    q,
    type,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  try {
    const response = await sourceService.listSources(
      page,
      size,
      fields,
      sort,
      id,
      q,
      type,
    )
    const { items, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [listResponseHandler]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getSource = async ({ itemId: id }) => {
  const itemResponseHandler = (item) => {
    if(item.source.type) {
      item.source.type = item.source.type.toLowerCase();
    }
    return item.source;
  };

  try {
    const response = await sourceService.locateSource(id);
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

const addSource = async ({ itemInstance }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await sourceService.createSource(item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateSource = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);

  try {
    const response = await sourceService.updateSource(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteSource = async ({ id }) => {
  try {
    const response = await sourceService.deleteSource(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const SourcesAPI = {
  getList: getSourcesList,
  get: getSource,
  add: addSource,
  update: updateSource,
  delete: deleteSource,
}

export default SourcesAPI;