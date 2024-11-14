import {
  getDefaultGetListResponse,
  getDefaultGetParams,
  getDefaultInstance,
} from '@webitel/ui-sdk/src/api/defaults/index.js';
import applyTransform, {
  camelToSnake,
  generateUrl,
  merge,
  mergeEach,
  notify,
  sanitize,
  snakeToCamel,
  starToSearch,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import deepCopy from 'deep-copy';
import ConvertDuration from '@webitel/ui-sdk/src/scripts/convertDuration.js';

const instance = getDefaultInstance();

const baseUrl = '/cases/slas';

const fieldsToSend = ['name', 'description', 'valid_from', 'valid_to', 'calendar', 'reaction_time', 'resolution_time'];

const getSlasList = async (params) => {
  const fieldsToSend = ['page', 'size', 'q', 'sort', 'fields', 'id'];

  const url = applyTransform(params, [
    merge(getDefaultGetParams()),
    starToSearch('search'),
    (params) => ({ ...params, q: params.search }),
    sanitize(fieldsToSend),
    camelToSnake(),
    generateUrl(baseUrl),
  ]);
  try {
    const response = await instance.get(url);
    const { items, next } = applyTransform(response.data, [
      snakeToCamel(['profile']),
      merge(getDefaultGetListResponse()),
    ]);
    return {
      items: applyTransform(items, []),
      next,
    };
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};



const getSla = async ({ itemId: id }) => {
  const itemResponseHandler = (item) => {
    return item.sla;
  };

  const url = applyTransform({ fields: fieldsToSend }, [
    generateUrl(`${baseUrl}/${id}`),
  ]);

  try {
    const response = await instance.get(url);
    return applyTransform(response.data, [
      itemResponseHandler,
    ]);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const convertTime = (value) => {
  const generalTime = ConvertDuration(value);
  const time = {};

  const hours = generalTime.split(':')[0];
  const hoursValue = hours[0] === '0' ? hours[1] : hours;

  const minutes = generalTime.split(':')[1];
  const minutesValue = minutes[0] === '0' ? minutes[1] : minutes;

  if(hoursValue !== '00' && hoursValue !== '0') {
    time.hours = hoursValue;
  }

  if(minutesValue !== '00' && minutesValue !== '0') {
    time.minutes = minutesValue;
  }

  if(!time.hours && !time.minutes) {
    return null;
  }

  return time;
}

const preRequestHandler = (item) => {
  const copy = deepCopy(item);

  if(copy.validFrom) {
    copy.validFrom = new Date(copy.validFrom).toISOString();
  }
  if(copy.validTo) {
    copy.validTo = new Date(copy.validTo).toISOString();
  }
  if(copy.reactionTime) {
    const timeValue = convertTime(copy.reactionTime);
    if(!timeValue) {
      delete copy.reactionTime;
    } else {
      copy.reactionTime = timeValue;
    }
  }

  if(copy.resolutionTime) {
    const timeValue = convertTime(copy.resolutionTime);
    if(!timeValue) {
      delete copy.resolutionTime;
    } else {
      copy.resolutionTime = timeValue;
    }
  }

  if(copy.calendar) {
    copy.calendarId = copy.calendar.id;
  }

  return copy;
};

const addSla = async ({ itemInstance }) => {
  const fieldsToSend = ['name', 'description', 'validFrom', 'validTo', 'calendarId', 'reactionTime', 'resolutionTime'];
  const item = applyTransform(itemInstance, [
    preRequestHandler,
    sanitize(fieldsToSend),
  ]);
  try {
    const response = await instance.post(baseUrl, item);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const deleteSla = async ({ id }) => {
  const url = `${baseUrl}/${id}`;
  try {
    const response = await instance.delete(url);
    return applyTransform(response.data, []);
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const SlasAPI = {
  getList: getSlasList,
  get: getSla,
  delete: deleteSla,
  add: addSla,
}

export default SlasAPI;
