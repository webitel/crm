import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import { ServicesApiFactory } from 'webitel-sdk';
import applyTransform, {
  camelToSnake,
  merge, notify,
  sanitize, snakeToCamel,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const servicesService = new ServicesApiFactory(configuration, '', instance);

const fieldsToSend = ['name', 'description', 'prefix', 'code',  'state', 'sla_id', 'status_id', 'close_reason_id', 'team_ids', 'skill_ids'];

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
  const fieldsToSend = ['name', 'code', 'sla', 'teams', 'skills', 'status', 'state', 'prefix', 'close_reason', 'reason', 'description', 'services'];

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
    sla_id: item.sla?.id,
    status_id: item.status?.id,
    close_reason_id: item.closeReason?.id,
    team_ids: item.teams?.map((team) => team.id),
    skill_ids: item.skills?.map((skill) => skill.id),
  }
};

const addService = async ({ itemInstance }) => {

  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await servicesService.createService(item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateService = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);
  try {
    const response = await servicesService.updateService(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchService = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);
  try {
    const response = await servicesService.updateService2(id, item);
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
