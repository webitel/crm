import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import { CatalogsApiFactory } from 'webitel-sdk';
import applyTransform, {
  camelToSnake,
  merge, notify,
  sanitize, snakeToCamel,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const catalogsService = new CatalogsApiFactory(configuration, '', instance);

const fieldsToSend = ['name', 'code', 'sla', 'statuses', 'teams', 'skills', 'status', 'prefix', 'reason', 'description'];

const getCatalogsList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

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
    const response = await catalogsService.listCatalogs(
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
      items: applyTransform(items, []),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getCatalog = async ({ itemId: id }) => {
  const itemResponseHandler = (item) => {
    return item.sla;
  };

  try {
    const response = await catalogsService.locateCatalog(id, fieldsToSend);
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
    calendarId: item.calendar.id,
  }
};

const addCatalog = async ({ itemInstance }) => {
  const fieldsToSend = ['name', 'description', 'services'];
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await catalogsService.createCatalog(item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCatalog = async ({ itemInstance, itemId: id }) => {
  const fieldsToSend = ['name', 'description', 'services'];
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);
  try {
    const response = await catalogsService.updateCatalog(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteCatalog = async ({ id }) => {
  try {
    const response = await catalogsService.deleteCatalog(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const CatalogsAPI = {
  getList: getCatalogsList,
  get: getCatalog,
  add: addCatalog,
  update: updateCatalog,
  delete: deleteCatalog,
}

export default CatalogsAPI;
