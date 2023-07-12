import applyTransform, {
  log,
  merge,
  starToSearch,
  camelToSnake,
  snakeToCamel,
  handleUnauthorized,
  notify,
  sanitize,
} from '@webitel/ui-sdk/src/api/transformers';
import {
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
import { ContactsApiFactory } from 'webitel-sdk';
import getDefaultGetListResponse
  from '../../../app/api/defaults/getDefaultGetListResponse';
import configuration from '../../../app/api/openAPIConfig';
import instance from '../../../app/api/instance';

const service = new ContactsApiFactory(configuration, '', instance);

const getList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];
  const {
    page,
    size,
    q,
    sort,
    fields,
    id,
  } = applyTransform(params, [
    sanitize(fieldsToSend),
    merge(getDefaultGetParams()),
    starToSearch('q'),
    camelToSnake(),
  ]);
  try {
    const response = await service.searchContacts(
      page,
      size,
      q,
      sort,
      fields,
      id,
    );
    const { data, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: data,
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      handleUnauthorized,
      notify,
    ]);
  }
};

export default {
  getList,
};
