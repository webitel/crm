import { applyTransform,
  merge,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/api-services/api/transformers';
import deepCopy from 'deep-copy';
import { CaseTimelineApiFactory, TimelineApiFactory } from 'webitel-sdk';

import getDefaultGetListResponse from '../../../app/api/defaults/getDefaultGetListResponse';
import instance from '../../../app/api/instance';
import configuration from '../../../app/api/openAPIConfig';
import { TimelineEventType } from '../enums/TimelineEventType';
import { TimelineMode } from '../enums/TimelineMode';

const listHandler = (items) => {
  const copy = deepCopy(items);
  if (copy.length) {
    return copy.map((day) => ({
      ...day,
      items: day.items.map((item) => ({
        ...item[item.type || TimelineEventType.Chat],
        type: item.type || TimelineEventType.Chat,
        createdAt: item.createdAt,
      })),
    }));
  }
  return [];
};

const getList = (getTimeline) => async (params) => {
  const fieldsToSend = [
    'parentId',
    'dateFrom',
    'dateTo',
    'type',
    'page',
    'size',
  ];
  const { parentId, dateFrom, dateTo, type, page, size } = applyTransform(
    params,
    [sanitize(fieldsToSend)],
  );
  try {
    const response = await getTimeline(
      parentId,
      `${page || 1}`,
      `${size || 10}`,
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
      items: applyTransform(days, [listHandler]),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const getCounters = (getTimelineCounter) => async (params) => {
  const defaultObject = {
    callsCount: 0,
    chatsCount: 0,
    emailsCount: 0,
    dateFrom: Date.now(),
    dateTo: Date.now(),
  };

  const { parentId } = applyTransform(params, [sanitize(['parentId'])]);

  try {
    const response = await getTimelineCounter(parentId);
    return applyTransform(response.data, [
      snakeToCamel(),
      merge(defaultObject),
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const contactTimeline = TimelineApiFactory(configuration, '', instance);
const caseTimeline = CaseTimelineApiFactory(configuration, '', instance);

const ApiModeMap = {
  [TimelineMode.Contact]: {
    getList: getList(contactTimeline.getTimeline),
    getCounters: getCounters(contactTimeline.getTimelineCounter),
  },
  [TimelineMode.Case]: {
    getList: getList(caseTimeline.getTimeline),
    getCounters: getCounters(caseTimeline.getTimelineCounter),
  },
};

export default {
  getList: ({ mode, ...rest }) => ApiModeMap[mode].getList(rest),
  getCounters: ({ mode, ...rest }) => ApiModeMap[mode].getCounters(rest),
};
