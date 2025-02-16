import applyTransform, {
  camelToSnake,
  generateUrl,
  notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers';

import instance from '../../../../../app/api/instance';
import { TimelineMode } from '../../../enums/TimelineMode';

const getList = (getMessages) => async (params) => {
  const mergeMessageData = ({ peers, messages }) => {
    return messages.map(({ from, ...message }) => {
      return {
        ...message,
        peer: peers[from.id - 1],
      };
    });
  };

  try {
    const response = await getMessages(params);
    const { peers, messages } = applyTransform(response.data, [
      snakeToCamel(),
    ]);
    return {
      items: applyTransform({ peers, messages }, [
        mergeMessageData,
      ]).reverse(),
    };
  } catch (err) {
    throw applyTransform(err, [
      notify,
    ]);
  }
};

const getContactMessages = (params) => {
  const url = applyTransform(params, [
    camelToSnake(),
    generateUrl(`contacts/${params.parentId}/chat/${params.taskId}/messages`),
  ]);

  return instance.get(url);
};

const getCaseMessages = (params) => {
  const url = applyTransform({
    peerType: 'case',
    peerId: params.parentId,
  }, [
    camelToSnake(),

    /* equals to CatalogApiFactory.getHistory
     * https://swagger.webitel.com/#/Catalog/Catalog_GetHistory
     *  */
    generateUrl(`chat/dialogs/${params.taskId}/messages`),
  ]);

  return instance.get(url);
};

export default {
  [TimelineMode.Contact]: {
    getList: getList(getContactMessages),
  },
  [TimelineMode.Case]: {
    getList: getList(getCaseMessages),
  }
};
