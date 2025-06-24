import {
  applyTransform,
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
  getDefaultGetParams,
} from '@webitel/api-services/api';
import { LabelsApiFactory } from 'webitel-sdk';

import instance from '../../../../../app/api/instance';
import configuration from '../../../../../app/api/openAPIConfig';

const service = new LabelsApiFactory(configuration, '', instance);

const getList = async (params) => {
  const fieldsToSend = ['page', 'size', 'search', 'sort', 'fields', 'id'];
  const {
    page,
    size,
    search,
    // sort,
    // fields,
    // id,
  } = applyTransform(params, [
    sanitize(fieldsToSend),
    merge(getDefaultGetParams()),
    starToSearch('search'),
    camelToSnake(),
  ]);
  try {
    const response = await service.getLabels(page, size, search);
    const { labels, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge({ labels: [], next: false }),
    ]);
    return {
      items: labels,
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

export default {
  getList,
};
