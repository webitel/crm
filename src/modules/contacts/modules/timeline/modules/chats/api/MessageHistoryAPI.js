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
    const peersMap = new Map(peers.map((peer) => [peer.id, peer]));
    return messages.map(({ peer, ...message }) => ({
      ...message,
      peer: peer && peersMap.get(message.peer.id),
    }));
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
      ]),
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
