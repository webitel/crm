import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import { CatalogsApiFactory, WebitelContactsGroupType } from 'webitel-sdk';
import applyTransform, {
  camelToSnake,
  merge, notify,
  sanitize, snakeToCamel,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const catalogsService = new CatalogsApiFactory(configuration, '', instance);

const fieldsToSend = ['id', 'name', 'code', 'sla', 'teams', 'skills', 'status', 'state', 'prefix', 'close_reason_group', 'reason', 'description', 'services'];
const servicesFieldsToSend = ['id', 'name', 'group', 'description', 'code', 'prefix', 'state', 'sla', 'root_id', 'catalog_id'];

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
      [...fields, 'services'],
      sort,
      id,
      q,
      true,
undefined,
      servicesFieldsToSend
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
    return item.catalog;
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
    state: item.state ?? true,
  }
};

const addCatalog = async ({ itemInstance }) => {
  const fieldsToSend = ['name', 'description', 'prefix', 'code',  'state', 'sla', 'status', 'close_reason_group', 'teams', 'skills'];
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
  const fieldsToSend = ['name', 'description', 'prefix', 'code',  'state', 'sla', 'status', 'close_reason_group', 'teams', 'skills'];
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

const patchCatalog = async ({ itemInstance, itemId: id }) => {
  const fieldsToSend = ['name', 'description', 'prefix', 'code',  'state', 'sla_id', 'status_id', 'close_reason_group', 'team_ids', 'skill_ids'];
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);
  try {
    const response = await catalogsService.updateCatalog2(id, item);
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
  patch: patchCatalog,
  delete: deleteCatalog,
}

export default CatalogsAPI;
