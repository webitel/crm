import { applyTransform,
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/api-services/api';
import { StatusConditionsApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const statusConditionsService = new StatusConditionsApiFactory(
  configuration,
  '',
  instance,
);

const getStatusConditionsList = async ({ statusId, ...rest }) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];
  const { page, size, fields, sort, id, q } = applyTransform(rest, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (rest) => ({ ...rest, q: rest.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  try {
    const response = await statusConditionsService.listStatusConditions(
      statusId,
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

//TODO: change fields after all apis is implemented
const getStatusConditionsLookup = ({ statusId, ...rest }) => {
  return getStatusConditionsList({
    statusId,
    ...rest,
    fields: rest.fields || ['id', 'name'],
  });
};

const StatusConditionsAPI = {
  getList: getStatusConditionsList,
  getLookup: getStatusConditionsLookup,
};

export default StatusConditionsAPI;
