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
import { CloseReasonsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const closeReasonsService = new CloseReasonsApiFactory(configuration, '', instance);

const getCloseReasonsList = async ({closeReasonGroupId, ...params}) => {
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
    const response = await closeReasonsService.listCloseReasons(
      closeReasonGroupId,
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
}

const getCloseReasonsLookup = (params) => {
  return getCloseReasonsList({
    ...params,
    fields: params.fields || ['id', 'name'],
  });
};

const CloseReasonsAPI = {
  getList: getCloseReasonsList,
  getLookup: getCloseReasonsLookup,
};

export default CloseReasonsAPI;
