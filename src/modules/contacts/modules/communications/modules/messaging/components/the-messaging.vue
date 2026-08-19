<template>
  <div class="messaging">
    <delete-confirmation-popup
      :shown="isConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <wt-send-message-popup
      v-if="isOpenChatPopup"
      :chat-item="selectItem"
      :user-id="userId"
      @close="closeChat"
    />

    <section class="table-section">
      <header class="table-title">
        <h3 class="table-title__title">
          {{ t('vocabulary.messaging') }}
        </h3>
      </header>

      <div class="table-section__table-wrapper">
        <wt-empty
          v-show="showEmpty"
          :image="imageEmpty"
          :text="textEmpty"
        />

        <wt-loader v-show="isLoading" />

        <wt-table
          v-show="dataList.length && !isLoading"
          :headers="shownHeaders"
          :data="dataList"
          :selectable="false"
          sortable
          @sort="updateSort"
        >
          <template #icon="{ item }">
            <wt-icon :icon="ProviderIconType[item.protocol]" />
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
              :disabled="isDisabledChatAction(item)"
              action="chat"
              @click="openChat(item)"
            />
            <wt-icon-action
              :disabled="disabledDelete"
              action="delete"
              @click="
                askDeleteConfirmation({
                  deleted: item,
                  callback: () => deleteEls(item),
                })
              "
            />
          </template>
        </wt-table>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ChatGatewayProvider } from '@webitel/api-services/enums';
import { WtEmpty, WtSendMessagePopup } from '@webitel/ui-sdk/components';
import { ProviderIconType } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { type StoreGeneric, storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserinfoStore } from '../../../../../../userinfo/store/userinfoStore';
import { useContactEditAccessControl } from '../../../../../composables/useContactEditAccessControl';
import { useContactCardStore } from '../../../../../stores/card/contactCardStore';
import dummyDark from '../assets/messaging-dummy-dark.svg';
import dummyLight from '../assets/messaging-dummy-light.svg';
import { useMessagingDatalistStore } from '../stores/datalist/messagingDatalistStore';

const { t } = useI18n();

const { disabledUpdate, disabledDelete } = useContactEditAccessControl();

const contactCardStore = useContactCardStore();
const { itemId: parentId } = storeToRefs(
	contactCardStore as unknown as StoreGeneric,
);

const { userId } = useUserinfoStore();

const tableStore = useMessagingDatalistStore();

const { dataList, error, isLoading, shownHeaders, filtersManager } =
	storeToRefs(tableStore);

const { initialize, updateSort, updateSize, deleteEls } = tableStore;

updateSize(1000);
watch(
	parentId,
	(id) => {
		if (id)
			initialize({
				parentId: id,
			});
	},
	{
		immediate: true,
	},
);

const {
	isVisible: isConfirmationPopup,
	deleteCount,
	deleteCallback,

	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const {
	showEmpty,
	image: imageEmpty,
	text: textEmpty,
} = useTableEmpty(
	{
		dataList,
		error,
		filters: computed(() => filtersManager.value.getAllValues()),
		isLoading,
	},
	computed(() => ({
		image: {
			empty: {
				dark: dummyDark,
				light: dummyLight,
			},
		},
		text: {
			empty: t('contacts.communications.messaging.empty'),
		},
	})),
);

const isOpenChatPopup = ref(false);
const selectItem = ref(null);

const availableProviders = [
	ChatGatewayProvider.TELEGRAM_BOT,
	ChatGatewayProvider.VIBER,
	ChatGatewayProvider.MESSENGER,
	ChatGatewayProvider.PORTAL,
	ChatGatewayProvider.CUSTOM,
];

function openChat(item) {
	isOpenChatPopup.value = true;
	selectItem.value = item;
}

function closeChat() {
	isOpenChatPopup.value = false;
	selectItem.value = null;
}

function isDisabledChatAction(item) {
	return !availableProviders.includes(item.protocol) || disabledUpdate.value;
}
</script>

<style lang="scss" scoped>
.messaging {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
