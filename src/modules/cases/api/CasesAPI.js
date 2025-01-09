import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
  getDefaultOpenAPIConfig,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { CasesApiFactory } from 'webitel-sdk';

const instance = getDefaultInstance();
const configuration = getDefaultOpenAPIConfig();

const casesService = new CasesApiFactory(configuration, '', instance);

const fieldsToSend = [
  'name',
  'subject',
  'description',
  'contact_info',
  'planned_reaction_at',
  'planned_resolve_at',
  'status_lookup',
  'close_reason_lookup',
  'author',
  'assignee',
  'reporter',
  'impacted',
  'group',
  'priority',
  'source',
  'status',
  'close',
  'rate',
  'timing',
  'sla_condition',
  'difference_in_reaction',
  'sla',
  'service',
  'comments',
  'related_cases',
  'links',
  'status_condition',
];

const getCasesList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'ids', 'sort', 'fields', 'filters'];

  console.log(params);
  const {
    page,
    size,
    q,
    ids,
    sort,
    fields,
    filters,
    options,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({
      ...params,
      q: params.search,
    }),
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await casesService.searchCases(
      page,
      size,
      q,
      ids,
      sort,
      fields,
      filters,
      options,
    );

    const {
      items,
      next,
    } = applyTransform(response.data, [
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

const getCase = async ({ itemId: id }) => {
  try {
    const response = await casesService.locateCase(id, fieldsToSend);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteCase = async ({ id }) => {
  try {
    const response = await casesService.deleteCase(id);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

//TODO: refactor if not needed
const preRequestHandler = (item) => {
  return {
    subject: item.subject,
    description: item.description,
    contact_info: item.contactInfo,
    status: item.status.id,
    author: item.author.id,
    assignee: item.assignee.id,
    reporter: item.reporter.id,
    impacted: item.impacted.id,
    group: item.group.id,
    source: item.source.id,
    priority: item.priority.id,
    service: item.service.id,
    sla: item.sla.id,
    rate: item.rate.id,
    close: {
      close_result: item.close.closeResult,
      close_reason: item.close.closeReason.id,
    }
  }
};
const updateCase = async ({ itemInstance, itemId: id }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);

  try {
    const response = await casesService.updateCase(id, item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const addCase = async ({ itemInstance }) => {
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await casesService.createCase(item);
    return applyTransform(response.data, [snakeToCamel()]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchCase = async ({ changes, id }) => {
  const body = applyTransform(changes, [
    sanitize(fieldsToSend),
    camelToSnake(),
  ]);
  try {
    const response = await casesService.updateCase(id, body);
    return applyTransform(response.data, [
      snakeToCamel(),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const casesAPI = {
  getList: getCasesList,
  get: getCase,
  delete: deleteCase,
  update: updateCase,
  add: addCase,
  patch: patchCase,
};

export default casesAPI;
