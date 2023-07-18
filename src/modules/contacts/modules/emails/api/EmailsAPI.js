import { getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults';
import applyTransform, {
  log,
  camelToSnake, handleUnauthorized,
  merge, notify,
  sanitize, snakeToCamel, starToSearch,
} from '@webitel/ui-sdk/src/api/transformers';
import { EmailsApiFactory } from 'webitel-sdk';
import getDefaultGetListResponse
  from '../../../../../app/api/defaults/getDefaultGetListResponse';
import configuration from '../../../../../app/api/openAPIConfig';
import instance from '../../../../../app/api/instance';

const service = new EmailsApiFactory(configuration, '', instance);

const getList = async (params) => {
  const fieldsToSend = ['parentId', 'page', 'size', 'q', 'sort', 'fields', 'id'];
  const {
    parentId,
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
    log,
  ]);
  try {
    const response = await service.listEmails(
      parentId,
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
