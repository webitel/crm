import { getDefaultGetParams } from '@webitel/ui-sdk/src/api/defaults';
import applyTransform, {
  camelToSnake,
  merge, notify,
  sanitize, snakeToCamel, starToSearch, mergeEach,
} from '@webitel/ui-sdk/src/api/transformers';
import deepCopy from 'deep-copy';
import { TimelineApiFactory } from 'webitel-sdk';
import getDefaultGetListResponse
  from '../../../../../app/api/defaults/getDefaultGetListResponse';
import configuration from '../../../../../app/api/openAPIConfig';
import instance from '../../../../../app/api/instance';

const timeline = new TimelineApiFactory(configuration, '', instance);

const listHandler = (items) => {
  let copy = deepCopy(items);
  if(copy) {
    return copy.map(day => ({
      ...day,
      items: day.items.map(item => ({
        ...item,
        type:!item.type ? 'chat' : item.type,
      }))
    }));
  } return copy;
}

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
          listHandler,
        ]),
        next,
      };
    } catch (err) {
      throw applyTransform(err, [
        notify,
      ]);
    }
  };

  export default { getList };;
