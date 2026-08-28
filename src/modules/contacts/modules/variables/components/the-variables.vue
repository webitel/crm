<template>
  <div class="variables">
    <variable-popup
      :parent-id="(parentId as unknown as string)"
      @close="close"
      @saved="loadDataList"
    />

    <delete-confirmation-popup
      :shown="isConfirmationPopup"
      :callback="deleteCallback"
      :delete-count="deleteCount"
      @close="closeDelete"
    />

    <section class="table-section">
      <header class="table-title">
        <h3 class="table-title__title">
          {{ t('contacts.attributes', 2) }}
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
          <template #key="{ item }">
            {{ item.key }}
          </template>
          <template #value="{ item }">
            {{ item.value }}
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

        <wt-pagination
          :next="next"
          :prev="page > 1"
          :size="size"
          debounce
          @change="updateSize"
          @next="updatePage(page + 1)"
          @prev="updatePage(page - 1)"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
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

import { useContactEditAccessControl } from '../../../composables/useContactEditAccessControl';
import { useContactCardStore } from '../../../stores/card/contactCardStore';
import { useVariablesDatalistStore } from '../stores/datalist/variablesDatalistStore';
import VariablePopup from './variable-popup.vue';

const { t } = useI18n();
const route = useRoute();

const { disabledAdd, disabledUpdate, disabledDelete } =
	useContactEditAccessControl();

const { open } = useCardListNavigation({
	routeParamName: 'variableId',
});
const { close } = useClose(route.name);

const contactCardStore = useContactCardStore();
const { itemId: parentId } = storeToRefs(contactCardStore);

const tableStore = useVariablesDatalistStore();

const {
	dataList,
	error,
	isLoading,
	page,
	size,
	next,
	shownHeaders,
	filtersManager,
} = storeToRefs(tableStore);

const {
	initialize,
	loadDataList,
	updatePage,
	updateSize,
	updateSort,
	deleteEls,
} = tableStore;

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
	primaryActionText: primaryActionTextEmpty,
} = useTableEmpty({
	dataList,
	error,
	filters: computed(() => filtersManager.value.getAllValues()),
	isLoading,
});
</script>

<style lang="scss" scoped></style>
