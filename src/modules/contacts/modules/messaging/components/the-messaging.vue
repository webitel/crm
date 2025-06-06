<template>
  <div class="contact-communication-tab">
    <delete-confirmation-popup
      :shown="isConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <wt-loader v-show="isLoading" />

    <wt-dummy
      v-if="!isLoading && showDummy"
      :src="darkMode ? dummyDark : dummyLight"
      :text="t('contacts.communications.messaging.dummy')"
    />

    <div
      v-show="!isLoading && !showDummy"
      class="table-wrapper"
    >
      <wt-table
        :headers="headers"
        :data="dataList"
        :selectable="false"
        sortable
        @sort="sort"
      >
        <template #icon="{ item }">
          <wt-icon :icon="iconType[item.protocol]" />
        </template>
        <template #protocol="{ item }">
          {{
            t(`contacts.communications.messaging.messengers.${item.protocol}`)
          }}
        </template>
        <template #app="{ item }">
          {{ item.app?.name }}
        </template>
        <template #user="{ item }">
          {{ item.user?.name }}
        </template>
        <template #actions="{ item }">
          <wt-icon-action
            :disabled="!access.hasRbacEditAccess || isReadOnly"
            action="delete"
            @click="
              askDeleteConfirmation({
                deleted: item,
                callback: () => deleteData(item),
              })
            "
          />
        </template>
      </wt-table>
    </div>
  </div>
</template>

<script setup>
import ChatGatewayProvider from '@webitel/ui-sdk/src/enums/ChatGatewayProvider/ChatGatewayProvider.enum';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { computed, inject, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import dummyDark from '../assets/messaging-dummy-dark.svg';
import dummyLight from '../assets/messaging-dummy-light.svg';

const access = inject('access');
const isReadOnly = inject('isReadOnly');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const store = useStore();
const { t } = useI18n();

const {
  namespace,

  dataList,
  isLoading,
  headers,
  error,

  deleteData,
  sort,
  onFilterEvent,
} = useTableStore(props.namespace);

const { subscribe, flushSubscribers, restoreFilters } =
  useTableFilters(namespace);

subscribe({
  event: '*',
  callback: onFilterEvent,
});

restoreFilters();

onUnmounted(() => {
  flushSubscribers();
});

const {
  isVisible: isConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const showDummy = computed(() => !dataList.value.length);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

const iconType = {
  [ChatGatewayProvider.TELEGRAM_BOT]: 'telegram-bot',
  [ChatGatewayProvider.TELEGRAM_APP]: 'messenger-telegram',
  [ChatGatewayProvider.MESSENGER]: 'meta',
  [ChatGatewayProvider.VIBER]: 'messenger-viber',
  [ChatGatewayProvider.WEBCHAT]: 'messenger-web-chat',
  [ChatGatewayProvider.INFOBIP]: 'messenger-infobip',
  [ChatGatewayProvider.CUSTOM]: 'custom-chat-gateway',
  [ChatGatewayProvider.PORTAL]: 'portal',
};
</script>

<style lang="scss" scoped>
@use '../../_shared/css/contact-communication-tab';
</style>
