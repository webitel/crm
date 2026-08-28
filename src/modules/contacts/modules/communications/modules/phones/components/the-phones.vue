<template>
  <div class="phones">
    <communication-popup
      :store="usePhonesCardStore"
      :parent-id="(parentId as unknown as string)"
      :channel="CommunicationChannel.Number"
      :is-first-record="!dataList.length"
      @close="close"
      @saved="loadDataList"
    />

    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <section class="table-section">
      <header class="table-title">
        <h3 class="table-title__title">
          {{ t('vocabulary.phones', 2) }}
        </h3>
        <wt-action-bar
          :include="[IconAction.ADD]"
          :disabled:add="disabledAdd"
          @click:add="open"
        />
      </header>

      <div class="table-section__table-wrapper">
        <wt-empty
          v-show="showEmpty"
          :image="imageEmpty"
          :text="textEmpty"
          :primary-action-text="primaryActionTextEmpty"
          :disabled-primary-action="disabledAdd"
          @click:primary="open()"
        />

        <wt-loader v-show="isLoading" />

        <wt-table
          v-show="dataList.length && !isLoading"
          :data="dataList"
          :headers="shownHeaders"
          :selectable="false"
          sortable
          @sort="updateSort"
        >
          <template #primary="{ item }">
            <wt-icon
              v-if="item.primary"
              icon="tick"
              color="success"
            />
            <wt-icon-btn
              v-else
              :disabled="disabledUpdate"
              class="phones__set-primary-btn"
              icon="tick"
              @click="setAsPrimary(item)"
            />
          </template>

          <template #type="{ item }">
            {{ item.type.name }}
          </template>

          <template #actions="{ item }">
            <wt-icon-action
              :disabled="disabledUpdate"
              action="edit"
              @click="open(item.id)"
            />
            <wt-icon-action
              :disabled="disabledDelete"
              action="delete"
              @click="
                askDeleteConfirmation({
                  deleted: [item],
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
import { PhonesAPI } from '@webitel/api-services/api';
import { useCardListNavigation } from '@webitel/ui-datalist/card';
import { WtEmpty } from '@webitel/ui-sdk/components';
import { useClose } from '@webitel/ui-sdk/composables';
import { IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useContactEditAccessControl } from '../../../../../composables/useContactEditAccessControl';
import { useContactCardStore } from '../../../../../stores/card/contactCardStore';
import CommunicationPopup from '../../../components/communications-popup.vue';
import { CommunicationChannel } from '../../../enums/CommunicationChannel';
import dummyDark from '../assets/phone-dummy-dark.svg';
import dummyLight from '../assets/phone-dummy-light.svg';
import { usePhonesCardStore } from '../stores/card/phonesCardStore';
import { usePhonesDatalistStore } from '../stores/datalist/phonesDatalistStore';

const { t } = useI18n();
const route = useRoute();

const { disabledAdd, disabledUpdate, disabledDelete } =
	useContactEditAccessControl();

const { open } = useCardListNavigation({
	routeParamName: 'commId',
});
const { close } = useClose(route.name);

const contactCardStore = useContactCardStore();
const { itemId: parentId } = storeToRefs(contactCardStore);

const tableStore = usePhonesDatalistStore();

const { dataList, error, isLoading, shownHeaders, filtersManager } =
	storeToRefs(tableStore);

const { initialize, loadDataList, updateSize, updateSort, deleteEls } =
	tableStore;

updateSize(1000);
watch(
	parentId,
	async (id) => {
		if (!id) return;
		await initialize({
			parentId: id,
		});
		// a newer contact navigation may have started while this one was in flight
		if (parentId.value !== id) {
			await initialize({
				parentId: parentId.value,
			});
		}
	},
	{
		immediate: true,
	},
);

const {
	isVisible: isDeleteConfirmationPopup,
	deleteCount,
	deleteCallback,

	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const {
	showEmpty,
	image: imageEmpty,
	text: textEmpty,
	primaryActionText: primaryActionTextEmpty,
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
			empty: t('contacts.communications.phones.empty'),
		},
	})),
);

async function setAsPrimary(item) {
	await PhonesAPI.patch({
		parentId: parentId.value,
		etag: item.etag,
		changes: {
			primary: true,
		},
	});
	await loadDataList();
}
</script>

<style lang="scss" scoped>
.phones__set-primary-btn {
  opacity: 0;
  transition: var(--transition);
  pointer-events: none;
}

.wt-table tr:hover .phones__set-primary-btn,
.phones__set-primary-btn:focus-visible {
  opacity: 1;
  pointer-events: auto;
}
</style>
