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
import { SLAsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const slaService = new SLAsApiFactory(configuration, '', instance);

const fieldsToSend = ['name', 'description', 'valid_from', 'valid_to', 'calendar', 'reaction_time', 'resolution_time'];

const getSlasList = async (params) => {
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
    const response = await slaService.listSLAs(
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

const getSla = async ({ itemId: id }) => {
  const itemResponseHandler = (item) => {
    return item.sla;
  };

  try {
    const response = await slaService.locateSLA(id, fieldsToSend);
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

const addSla = async ({ itemInstance }) => {
  const fieldsToSend = ['name', 'description', 'valid_from', 'valid_to', 'calendar_id', 'reaction_time', 'resolution_time']; //difference with top list - field calendar_id
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await slaService.createSLA(item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateSla = async ({ itemInstance, itemId: id }) => {
  const fieldsToSend = ['name', 'description', 'valid_from', 'valid_to', 'calendar_id', 'reaction_time', 'resolution_time'];
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend)]);
  try {
    const response = await slaService.updateSLA(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteSla = async ({ id }) => {
  try {
    const response = await slaService.deleteSLA(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const SlasAPI = {
  getList: getSlasList,
  get: getSla,
  add: addSla,
  update: updateSla,
  delete: deleteSla,
}

export default SlasAPI;
