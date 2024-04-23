import applyTransform, {
  notify,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers';
import { TimelineApiFactory } from 'webitel-sdk';
import instance from '../../../../../../../app/api/instance';
import configuration from '../../../../../../../app/api/openAPIConfig';

const service = new TimelineApiFactory(configuration, '', instance);

const getList = async ({ contactId, chatId }) => {
  const mergeMessageData = ({ peers, chats, messages }) => {
    const peersMap = new Map(peers.map((peer) => [peer.id, peer]));
    const chatsMap = new Map(chats.map((chat) => [chat.id, chat]));
    return messages.map((message) => ({
      ...message,
      peer: peersMap.get(message.peer.id),
      chat: chatsMap.get(message.chat.id),
    }));
  };

  try {
    const response = await service.getDetailedMessageHistory(
      contactId,
      chatId,
    );
    const { chats, peers, messages } = applyTransform(response.data, [
      snakeToCamel(),
    ]);
    return {
      items: applyTransform({ chats, peers, messages }, [
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
