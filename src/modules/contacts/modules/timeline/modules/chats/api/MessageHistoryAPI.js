import applyTransform, {
  notify,
  snakeToCamel,
  camelToSnake,
  generateUrl,
} from '@webitel/ui-sdk/src/api/transformers/index.js';

import instance from '../../../../../../../app/api/instance';

const getList = async (params) => {
  const mergeMessageData = ({ peers, messages }) => {
    return messages.map(({ from, ...message }) => {
      return {
        ...message,
        peer: peers[from.id - 1],
      };
    });
  };
  const url = applyTransform(params, [
    camelToSnake(),
    generateUrl(`contacts/${params.parentId}/chat/${params.taskId}/messages`),
  ]);

  try {
    const response = await instance.get(url);
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

export default {
  getList,
};
