import { applyTransform,
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
  camelToSnake,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/api-services/api';
import { StatusesApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const statusesService = new StatusesApiFactory(configuration, '', instance);

const getStatusesList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const { page, size, fields, sort, id, q } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  try {
    const response = await statusesService.listStatuses(
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

const getStatus = async ({ statusId: id }) => {
  try {
    const response = await statusesService.locateStatus(id);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getStatusesLookup = (params) => {
  return getStatusesList({
    ...params,
    fields: params.fields || ['id', 'name'],
  });
};

const StatusesAPI = {
  getList: getStatusesList,
  get: getStatus,
  getLookup: getStatusesLookup,
};

export default StatusesAPI;
