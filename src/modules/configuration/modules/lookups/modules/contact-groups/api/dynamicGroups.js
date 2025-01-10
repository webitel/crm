import {
  getDefaultInstance, getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { DynamicGroupsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const dynamicContactGroupsService = new DynamicGroupsApiFactory(configuration, '', instance);

const fieldsToSend = ['name', 'description', 'enabled', 'type', 'default_group_id'];

const preRequestHandler = (item) => {
  return {
    ...item,
    type: item.type,
    defaultGroupId: item.defaultGroup.id,
  }
};

const addDynamicContactGroup = async (itemInstance) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  try {
    const response = await dynamicContactGroupsService.createDynamicGroup(item);
    return applyTransform(response.data, [
      snakeToCamel()
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateDynamicContactGroup = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [preRequestHandler, camelToSnake(), sanitize(fieldsToSend)]);

  try {
    const response = await dynamicContactGroupsService.updateDynamicGroup(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const dynamicContactGroupsAPI = {
  add: addDynamicContactGroup,
  update: updateDynamicContactGroup,
}

export default dynamicContactGroupsAPI;
