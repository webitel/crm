import applyTransform, {
  notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers';
import { CatalogApiFactory } from 'webitel-sdk';
import instance from '../../../../../../../app/api/instance';
import configuration from '../../../../../../../app/api/openAPIConfig';

const service = new CatalogApiFactory(configuration, '', instance);

const getList = async ({ taskId }) => {
  const mergeMessageData = ({ peers, messages }) => {
    return messages.map(({ from, ...message }) => {
      return {
        ...message,
        peer: peers[from.id - 1],
      };
    });
  };

  try {
    const response = await service.getHistory(
      taskId,
    );
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
