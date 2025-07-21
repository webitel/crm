import {
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/api-services/api/defaults';
import { applyTransform,
  camelToSnake,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/api-services/api/transformers';
import { ExtensionsApiFactory } from 'webitel-sdk';

import sortFields from '../utils/sortDynamicField';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const typeExtensionsService = new ExtensionsApiFactory(
  configuration,
  '',
  instance,
);

const fieldsToSend = ['fields', 'repo', 'path'];

const itemResponseHandler = (item) => ({
  ...item,
  id: item.repo,
});

const getExtension = async ({ itemId: itemRepo }) => {
  const createPositionGenerator = () => {
    let position = 1;
    return (item) => (item.readonly ? null : position++);
  };
  const getPosition = createPositionGenerator();

  const itemResponseHandler = (item) => ({
    ...item,
    id: item.repo,
    fields: item.fields.map((field) => ({
      ...field,
      position: getPosition(field),
    })),
  });

  try {
    const response = await typeExtensionsService.locateType(itemRepo);

    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    return {
      id: itemRepo,
      fields: [],
      isNew: true,
    };
    throw applyTransform(err, [notify]);
  }
};

const addExtension = async ({ itemInstance, itemId: id }) => {
  const repo = id;

  const item = applyTransform(itemInstance, [
    sortFields,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await typeExtensionsService.createType(repo, item);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateExtension = async ({ itemInstance, itemId: id }) => {
  const repo = id;

  if (!itemInstance.fields.length && itemInstance.isNew) {
    return itemInstance;
  } else if (itemInstance.isNew) {
    return addExtension({ itemInstance, itemId: id });
  }

  if (!itemInstance.fields.length && !itemInstance.isNew) {
    return deleteExtension({ itemId: id });
  }

  const item = applyTransform(itemInstance, [
    sortFields,
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await typeExtensionsService.updateType(repo, item);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteExtension = async ({ itemId: id }) => {
  try {
    await typeExtensionsService.deleteType(id);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const WtTypeExtensionApi = {
  add: addExtension,
  get: getExtension,
  update: updateExtension,
  delete: deleteExtension,
};

export default WtTypeExtensionApi;
