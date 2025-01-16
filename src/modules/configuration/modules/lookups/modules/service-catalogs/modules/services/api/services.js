import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import { ServicesApiFactory, WebitelContactsGroupType } from 'webitel-sdk';
import applyTransform, {
  camelToSnake,
  merge, notify,
  sanitize, snakeToCamel,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const servicesService = new ServicesApiFactory(configuration, '', instance);

const fieldsToSend = ['name', 'code', 'sla', 'status', 'state', 'description', 'group', 'assignee', 'services', 'root_id'];

const getServicesList = async ({ rootId, ...rest }) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const {
    page,
    size,
    fields,
    sort,
    id,
    q,
  } = applyTransform(rest, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await servicesService.listServices(
      page,
      size,
      sort,
      id,
      q,
      rootId,
      undefined,
      fields
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

const getService = async ({ itemId: id }) => {
  const fieldsToSend = ['name', 'code', 'sla', 'state', 'prefix', 'group', 'assignee', 'description', 'catalog_id'];

  const itemResponseHandler = (item) => {
    return item.service;
  };

  try {
    const response = await servicesService.locateService(id, fieldsToSend);
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
    assignee: item.group?.type === WebitelContactsGroupType.DYNAMIC ? {} : item.assignee,
  }
};

const addService = async ({ itemInstance, rootId, catalogId }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  item.root_id = rootId;
  item.catalog_id = catalogId;

  try {
    const response = await servicesService.createService(item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateService = async ({ itemInstance, itemId: id, rootId, catalogId }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);

  item.root_id = rootId;
  item.catalog_id = catalogId;
  try {
    const response = await servicesService.updateService(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchService = async ({ changes, id }) => {
  const body = applyTransform(changes, [sanitize(fieldsToSend), camelToSnake()]);
  try {
    const response = await servicesService.updateService2(id, body);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteService = async ({ id }) => {
  try {
    const response = await servicesService.deleteService(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const ServicesAPI = {
  getList: getServicesList,
  get: getService,
  add: addService,
  update: updateService,
  patch: patchService,
  delete: deleteService,
}

export default ServicesAPI;
