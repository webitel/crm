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
  getDefaultGetListResponse,
  getDefaultGetParams,
} from '@webitel/ui-sdk/src/api/defaults';
// import { ContactsApiFactory } from '../../../app/api/contacts';
import configuration from '../../../app/api/openAPIConfig';
import instance from '../../../app/api/instance';

// const service = new ContactsApiFactory(configuration, '', instance);

const getList = async (params) => {
  // const {
  //   page,
  //   size,
  //   q,
  //   sort,
  //   fields,
  //   id,
  // } = applyTransform(params, [
  //   merge(getDefaultGetParams()),
  //   starToSearch('q'),
  //   camelToSnake(),
  // ]);
  // try {
  //   const response = await service.searchContacts(
  //     q,
  //     undefined,
  //     id,
  //     undefined,
  //     page,size,
  //     sort,fields,
  //     // page,
  //     // size,
  //     // q,
  //     // sort,
  //     // fields,
  //     // id,
  //   );
  //   const { items, next } = applyTransform(response.data, [
  //     snakeToCamel(),
  //     merge(getDefaultGetListResponse()),
  //   ]);
  //   return {
  //     items,
  //     next,
  //   };
  // } catch (err) {
  //   throw applyTransform(err, [
  //     handleUnauthorized,
  //     notify,
  //   ]);
  // }
  return [];
};

export default {
  getList,
};
