import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/api-services/api/defaults';
import {
  applyTransform,
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/api-services/api/transformers';
import { CatalogsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const catalogsService = new CatalogsApiFactory(configuration, '', instance);

const fieldsToSend = [
  'id',
  'name',
  'code',
  'sla',
  'teams',
  'skills',
  'status',
  'state',
  'prefix',
  'close_reason_group',
  'reason',
  'description',
  'services',
];
const servicesFieldsToSend = [
  'id',
  'name',
  'group',
  'assignee',
  'assignee.name',
  'description',
  'code',
  'prefix',
  'state',
  'sla',
  'root_id',
  'catalog_id',
];

const getCatalogsList = async (params) => {
  const fieldsToSend = [
    'page',
    'size',
    'q',
    'sort',
    'fields',
    'id',
    'hasSubservices',
  ];

  const { page, size, fields, sort, id, q, state, has_subservices } =
    applyTransform(params, [
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
      state,
      undefined,
      servicesFieldsToSend,
      has_subservices,
    );
    const { items, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, [snakeToCamel()]),
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
    const response = await catalogsService.locateCatalog(
      id,
      fieldsToSend,
      servicesFieldsToSend,
    );
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const addCatalog = async ({ itemInstance }) => {
  const fieldsToSend = [
    'name',
    'description',
    'prefix',
    'code',
    'state',
    'sla',
    'status',
    'close_reason_group',
    'teams',
    'skills',
  ];
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await catalogsService.createCatalog(item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCatalog = async ({ itemInstance, itemId: id }) => {
  const fieldsToSend = [
    'name',
    'description',
    'prefix',
    'code',
    'state',
    'sla',
    'status',
    'close_reason_group',
    'teams',
    'skills',
  ];
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await catalogsService.updateCatalog(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchCatalog = async ({ itemInstance, itemId: id }) => {
  const fieldsToSend = ['name', 'description', 'state'];
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
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
};

export default CatalogsAPI;
