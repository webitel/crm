<template>
  <wt-popup
    v-bind="$attrs"
    class="contact-send-message"
    overflow
    @close="emit('close')"
  >
    <template #header>
      {{ t('contacts.communications.messaging.sendMessage') }}
    </template>

    <template #main>
      <wt-select
        :value="draft.gateway"
        :search-method="getChatGateways"
        :label="t('objects.chatGateway')"
        :placeholder="t('objects.chatGateway')"
        track-by="id"
        clearable
        @input="draft.gateway = $event"
      >
        <template #singleLabel="{ option }">
          <div class="contact-send-message__gateway">
            <wt-icon :icon="ProviderIconType[option.provider]" />
            <span>{{ option.name }}</span>
          </div>
        </template>
        <template #option="{ option }">
          <div class="contact-send-message__gateway">
            <wt-icon :icon="ProviderIconType[option.provider]" />
            <span>{{ option.name }}</span>
          </div>
        </template>
      </wt-select>

      <wt-textarea
        :value="draft.message"
        :placeholder="$t('objects.chat.draftPlaceholder')"
        @enter="sendMessage"
        @input="draft.message = $event"
      />
    </template>
    <template #actions>
      <wt-chat-emoji
        class="contact-send-message__emoji"
        @insert-emoji="insertEmoji"
      />

      <wt-rounded-action
        icon="chat-send"
        color="accent"
        rounded
        :disabled="!draft.message || !draft.gateway?.id"
        wide
        @click="sendMessage"
      />
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import { AgentsAPI, ChatGatewaysAPI, MessagesServiceAPI } from '@webitel/api-services/api';
import { ChatGatewayProvider } from '@webitel/api-services/enums';
import { WtChatEmoji, WtSelect } from '@webitel/ui-sdk/components';
import { ProviderIconType } from '@webitel/ui-sdk/enums';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserinfoStore } from '../../../../src/modules/userinfo/store/userinfoStore';

const availableProviders = [
  ChatGatewayProvider.TELEGRAM_BOT,
  ChatGatewayProvider.VIBER,
  ChatGatewayProvider.MESSENGER,
  ChatGatewayProvider.PORTAL,
];

const { t } = useI18n();

interface Item {
  id: string;
  protocol: string;
  externalId: string;
  createdAt: string;
  etag: string;
  app: {
    id: string;
    name: string;
  }
  user: {
    id: string;
    name: string;
  }
}

const props = defineProps<{
  item?: Item;
}>();

const emit = defineEmits(['close']);

const generateNewDraft = () => {
  const provider = props.item?.protocol;

  const gateway = availableProviders.includes(provider)
    ? { provider, ...props.item?.app }
    : {};

  return {
    gateway,
    message: '',
    agentId: null,
  };
};

const draft = ref(generateNewDraft());
const { userId } = useUserinfoStore();

async function getAgentId (params) {
  try {
    const { items } = await AgentsAPI.getList({ ...params, userId });
    draft.value.agentId = items[0]?.id;
  } catch (e) {
    console.error('Error fetching agent ID:', e);
  }
}
getAgentId();

async function getChatGateways(params) {
  return await ChatGatewaysAPI.getLookup({
    ...params,
    fields: ['provider', 'id', 'name'],
    provider: availableProviders });
}

const sendMessage = async () => {
  await MessagesServiceAPI.patch({
    peers: [{
      via: draft.value.gateway.id,
      id: props.item?.externalId,
      type: draft.value.gateway.provider,
    }],
    variables: {
      agentId: draft.value.agentId,
    },
    message: {
      text: draft.value.message,
    }
  });
  emit('close');
};

const insertEmoji = (emoji) => {
  draft.value.message += emoji;
};
</script>

<style lang="scss" scoped>
.contact-send-message__gateway {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.contact-send-message__emoji {
  :deep(.wt-chat-emoji__wrapper emoji-picker) {
    position: absolute;
    transform: translateX(-50%);
    bottom: 100%;
    left: 50%;
    z-index: 1000;
  }
}
</style>
