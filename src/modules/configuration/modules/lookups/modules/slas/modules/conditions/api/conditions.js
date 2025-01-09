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
import { SLAConditionsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const slaConditionsService = new SLAConditionsApiFactory(configuration, '', instance);

const fieldsToSend = [
  'name',
  'priorities',
  'sla_id',
  'reaction_time',
  'resolution_time',
];

const getConditionsList = async ({ parentId, ...rest }) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id', 'slaConditionId', 'priorityId'];

  const {
    page,
    size,
    fields,
    sort,
    id,
    q,
    slaConditionId,
    priorityId,
  } = applyTransform(rest, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await slaConditionsService.listSLAConditions(
      parentId,
      page,
      size,
      fields,
      sort,
      id,
      q,
      slaConditionId,
      priorityId,
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

const getCondition = async ({ parentId, itemId: id }) => {
  const itemResponseHandler = (item) => {
    return item.slaCondition;
  };

  try {
    const response = await slaConditionsService.locateSLACondition(parentId, id, fieldsToSend);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const preRequestHandler = (item) => {
  if (!item.priorities) return item;
  return {
    ...item,
    priorities: item.priorities?.map((priority) => priority.id),
  };
};

const updateCondition = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  try {
    const response = await slaConditionsService.updateSLACondition(itemInstance.slaId, id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const addCondition = async ({ itemInstance, parentId }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  try {
    const response = await slaConditionsService.createSLACondition(parentId, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteCondition = async ({ id, parentId }) => {
  try {
    const response = await slaConditionsService.deleteSLACondition(parentId, id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const ConditionsAPI = {
  getList: getConditionsList,
  get: getCondition,
  update: updateCondition,
  delete: deleteCondition,
  add: addCondition,
};

export default ConditionsAPI;
