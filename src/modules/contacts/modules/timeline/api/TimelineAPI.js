import { getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults';
import applyTransform, {
  camelToSnake,
  merge, notify,
  sanitize, snakeToCamel, starToSearch, mergeEach,
} from '@webitel/ui-sdk/src/api/transformers';
import { TimelineApiFactory } from 'webitel-sdk';
import getDefaultGetListResponse
  from '../../../../../app/api/defaults/getDefaultGetListResponse';
import configuration from '../../../../../app/api/openAPIConfig';
import instance from '../../../../../app/api/instance';

const timeline = new TimelineApiFactory(configuration, '', instance);

const getList = async (params) => {
  const fieldsToSend = ['parentId', 'dateFrom', 'dateTo', 'type'];
  const {
    parentId,
    dateFrom,
    dateTo,
    type,
  } = applyTransform(params, [
    sanitize(fieldsToSend),
    merge(getDefaultGetParams()),
  ]);
  try {
    const response = await timeline.getTimeline(
      parentId,
      dateFrom,
      dateTo,
      type,
    );
    const { days, next } = applyTransform(response.data, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(days, [
      ]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};


export default {getList}
