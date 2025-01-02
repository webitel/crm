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
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { DynamicConditionsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const dynamicGroupConditionsService = new DynamicConditionsApiFactory(configuration, '', instance);

const fieldsToSend = [
  'assignee',
  'expression',
  'group',
];

const getConditionsList = async ({ parentId, ...rest }) => {
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
    const response = await dynamicGroupConditionsService.listConditions(
      parentId,
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
      items: applyTransform(items, [snakeToCamel()]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getCondition = async ({ itemId: id }) => {
  const itemResponseHandler = (item) => {
    return item.condition;
  };

  try {
    const response = await dynamicGroupConditionsService.locateCondition(id, fieldsToSend);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const preRequestHandler = (item) => {
  if (!item.group) return item;
  if (!isEmpty(item.assignee)) {
    item.assignee = item.assignee.id;
  } else {
    item.assignee = 0;
  }
  return {
    ...item,
    group: item.group.id,
  };
};

const updateCondition = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  try {
    const response = await dynamicGroupConditionsService.updateCondition(id, item);
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
    const response = await dynamicGroupConditionsService.createCondition(parentId, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchCondition = async ({ parentId, changes }) => {

  const item = applyTransform(changes, [
    camelToSnake(),
  ]);

  try {
    const response = await dynamicGroupConditionsService.updateCondition2(parentId, item);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteCondition = async ({ id, parentId }) => {
  try {
    const response = await dynamicGroupConditionsService.deleteCondition(parentId, id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const ConditionsAPI = {
  getList: getConditionsList,
  get: getCondition,
  update: updateCondition,
  patch: patchCondition,
  delete: deleteCondition,
  add: addCondition,
};

export default ConditionsAPI;
