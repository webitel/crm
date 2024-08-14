import {
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,

  merge, notify, sanitize, snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import { CommunicationTypeServiceApiFactory } from 'webitel-sdk';
import instance from '../../../app/api/instance';
import configuration from '../../../app/api/openAPIConfig';

const communicationService = new CommunicationTypeServiceApiFactory(configuration, '', instance);

const getList = async (params) => {
  const {
    page,
    size,
    search,
    sort,
    fields,
    id,
    channel,
  } = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
  ]);

  try {
    const response = await communicationService.searchCommunicationType(
      page,
      size,
      search,
      sort,
      fields,
      id,
      channel,
    );
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items,
      next,
    };
  } catch (err) {
    throw applyTransform(err, [

      notify,
    ]);
  }
};

const getLookup = (params) => getList({
  ...params,
  fields: params.fields || ['id', 'name'],
});

const CommunicationTypesAPI = {
  getList,
  getLookup,
};

export default CommunicationTypesAPI;
