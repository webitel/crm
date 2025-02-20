import {
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import deepCopy from 'deep-copy';
import { ExtensionsApiFactory } from 'webitel-sdk';

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
    throw applyTransform(err, [notify]);
  }
};

const updateExtension = async ({ itemInstance, itemId: id }) => {
  const repo = id;

  const sortFields = (item) => {
    const unSortableFields = item.fields.filter((field) => !field.position);

    const fields = deepCopy(item.fields)
      .filter((field) => field.position)
      .sort((a, b) => {
        return a.position - b.position;
      });

    fields.splice(1, 0, ...unSortableFields);

    return {
      ...item,
      fields,
    };
  };

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

const WtTypeExtensionApi = {
  get: getExtension,
  update: updateExtension,
};

export default WtTypeExtensionApi;
