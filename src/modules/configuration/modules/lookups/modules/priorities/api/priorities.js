import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance, getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import {PrioritiesApiFactory} from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const priorityService = new PrioritiesApiFactory(configuration, '', instance);

const fieldsToSend = ['name', 'description', 'color'];

const getPrioritiesList = async (params) => {
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
    const response = await priorityService.listPriorities(
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

const getConditionsLookup = (params) =>
  getPrioritiesList({
    ...params,
    fields: params.fields || ['id', 'name'],
  });

const addPriority = async ({ itemInstance, parentId }) => {
  const item = applyTransform(itemInstance, [
    camelToSnake(),
    sanitize(fieldsToSend),
  ]);

  try {
    const response = await priorityService.createPriority(item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deletePriority = async ({ id }) => {
  try {
    const response = await priorityService.deletePriority(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const PrioritiesAPI = {
  getList: getPrioritiesList,
  getLookup: getConditionsLookup,
  delete: deletePriority,
  add: addPriority,
}

export default PrioritiesAPI;
