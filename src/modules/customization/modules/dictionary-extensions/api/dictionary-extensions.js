import { getDefaultInstance } from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();

const baseUrl = '/types/extensions/';

const itemResponseHandler = (item) => ({
  ...item,
  id: item.repo,
});

const getExtension = async ({ itemId: itemRepo, ...params }) => {
  const fieldsToSend = ['fields'];

  const url = applyTransform(params, [
    sanitize(fieldsToSend),
    camelToSnake(),
    generateUrl(baseUrl + itemRepo),
  ]);
  try {
    const response = await instance.get(url);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateExtension = async ({ itemInstance, itemId: id }) => {
  const repo = id;

  // TODO implement update extension
};

const DictionaryExtensionApi = {
  get: getExtension,
  update: updateExtension,
};

export default DictionaryExtensionApi;
