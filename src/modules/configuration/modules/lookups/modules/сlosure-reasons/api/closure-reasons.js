import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import { CloseReasonGroupsApiFactory } from 'webitel-sdk';
import applyTransform, {
  camelToSnake,
  merge,
  notify,
  sanitize,
  starToSearch
} from '@webitel/ui-sdk/src/api/transformers/index.js';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const closeReasonsService = new CloseReasonGroupsApiFactory(configuration, '', instance);

const getClosureReasonsList = async (params) => {
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
    const response = await closeReasonsService.listCloseReasonGroups(
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
      items,
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getClosureReasonsLookup = async (params) => getClosureReasonsList({
  ...params,
  fields: params.fields || ['id', 'name'],
})

const CloseReasonsApi = {
  getList: getClosureReasonsList,
  getLookup: getClosureReasonsLookup,
}

export default CloseReasonsApi;
