import { generatePermissionsApi } from '@webitel/ui-sdk/src/api/clients/_shared/generatePermissionsApi.js';
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
import deepCopy from 'deep-copy';
import { DictionariesApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const baseUrl = '/types/dictionaries';

const dictionariesService = new DictionariesApiFactory(
  configuration,
  '',
  instance,
);

const fieldsToSend = [
  'name',
  'description',
  'dictionary',
  'fields',
  'repo',
  'administered',
  'primary',
  'display',
];

const getCustomLookupsList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const { page, size, fields, sort, id, q } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await dictionariesService.searchType(
      q,
      id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      size,
      page,
      sort,
      fields,
    );
    const { data, next } = applyTransform(response.data, [
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(data, [snakeToCamel()]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getCustomLookup = async ({ itemId: itemRepo }) => {
  function* createPositionGenerator() {
    let position = 1;
    while (true) {
      const item = yield;
      if (item.readonly) {
        yield null;
      } else {
        yield position++;
      }
    }
  }
  const generator = createPositionGenerator();
  generator.next();

  const itemResponseHandler = (item) => ({
    ...item,
    fields: item.fields.map((field) => ({
      ...field,
      position: generator.next(field).value,
    })),
  });

  try {
    const response = await dictionariesService.locateType(
      itemRepo,
      fieldsToSend,
    );

    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const itemResponseHandler = (item) => ({
  ...item,
  id: item.repo,
});

const addCustomLookup = async ({ itemInstance }) => {
  const repo = itemInstance.repo;
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await dictionariesService.createType(repo, item);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCustomLookup = async ({ itemInstance, itemId: id }) => {
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
    const response = await dictionariesService.updateType(repo, item);
    return applyTransform(response.data, [snakeToCamel(), itemResponseHandler]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const CustomLookupsApi = {
  getList: getCustomLookupsList,
  get: getCustomLookup,
  add: addCustomLookup,
  update: updateCustomLookup,

  ...generatePermissionsApi(baseUrl),
};

export default CustomLookupsApi;
