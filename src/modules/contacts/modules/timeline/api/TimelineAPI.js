import applyTransform, {
  merge, notify,
  sanitize, snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import deepCopy from 'deep-copy';
import { TimelineApiFactory, WebitelContactsTimelineEventType } from 'webitel-sdk';
import getDefaultGetListResponse
  from '../../../../../app/api/defaults/getDefaultGetListResponse';
import configuration from '../../../../../app/api/openAPIConfig';
import instance from '../../../../../app/api/instance';

const timeline = new TimelineApiFactory(configuration, '', instance);

const listHandler = (items) => {
  let copy = deepCopy(items);
  if(copy.length) {
    return copy.map(day => ({
      ...day,
      items: day.items.map(item => ({
        ...item[item.type || WebitelContactsTimelineEventType.Chat],
        type: item.type || WebitelContactsTimelineEventType.Chat,
        createdAt: item.createdAt,
      }))
    }));
  } return [];
}

  const getList = async (params) => {
    const fieldsToSend = ['parentId', 'dateFrom', 'dateTo', 'type', 'page', 'size'];
    const {
      parentId,
      dateFrom,
      dateTo,
      type,
      page,
      size,
    } = applyTransform(params, [
      sanitize(fieldsToSend),
    ]);
    try {
      const response = await timeline.getTimeline(
        parentId,
        `${page || 1}`,
        `${size || 100}`,
        undefined,
        undefined,
        undefined,
        undefined,
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

const getCounters = async (params) => {
  const defaultObject = {
    callsCount: 0,
    chatsCount: 0,
    emailsCount: 0,
    dateFrom: Date.now(),
    dateTo: Date.now(),
  };

  const {
    parentId,
  } = applyTransform(params, [
    sanitize(['parentId']),
  ]);

  try {
    const response = await timeline.getTimelineCounter(parentId);
    return applyTransform(response.data, [
      snakeToCamel(),
      merge(defaultObject),
    ]);
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

  export default {
    getList,
    getCounters,
  };
