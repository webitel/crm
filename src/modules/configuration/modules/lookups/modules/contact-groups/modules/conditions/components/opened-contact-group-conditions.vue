<template>
  <section class="table-page opened-contact-group-conditions">
    <condition-popup @load-data="loadDataList" />

    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :delete-count="deleteCount"
      :callback="deleteCallback"
      @close="closeDelete"
    />
    <header class="table-title">
      <h3 class="table-title__title">
        {{ t('lookups.slas.conditions', 2) }}
      </h3>

      <wt-action-bar
        :include="[IconAction.ADD, IconAction.REFRESH]"
        :disabled:add="!hasCreateAccess"
        @click:add="add"
        @click:refresh="loadDataList"
      />
    </header>

    <div class="table-section__table-wrapper">
      <wt-empty
        v-show="showEmpty"
        :image="imageEmpty"
        :text="textEmpty"
        :primary-action-text="primaryActionTextEmpty"
        :disabled-primary-action="!hasCreateAccess"
        @click:primary="add"
      />

      <wt-loader v-show="isLoading" />

      <wt-table
        v-show="dataList.length && !isLoading"
        :data="dataList"
        :headers="shownHeaders"
        :selectable="false"
        :row-reorder="hasUpdateAccess"
        @reorder:row="handleReorder"
      >
        <template #expression="{ item }">
          {{ item.expression }}
        </template>
        <template #group="{ item }">
          {{ item.group.name }}
        </template>
        <template #assignee="{ item }">
          {{ item.assignee?.name }}
        </template>
        <template #actions="{ item }">
          <wt-icon-action
            :disabled="!hasUpdateAccess"
            action="edit"
            @click="
              router.push({ ...route, params: { conditionId: item.id } })
            "
          />
          <wt-icon-action
            :disabled="!hasDeleteAccess"
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
</template>

<script lang="ts" setup>
import { DynamicConditionsAPI } from '@webitel/api-services/api';
import { WtEmpty } from '@webitel/ui-sdk/components';
import { IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { useContactGroupConditionsDatalistStore } from '../stores';
import ConditionPopup from './opened-contact-group-conditions-popup.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
	useUserAccessControl({
		useUpdateAccessAsAllMutableChecksSource: true,
	});

const parentId = computed(() => route.params.id as string);

const tableStore = useContactGroupConditionsDatalistStore();

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

const { initialize, loadDataList, updatePage, updateSize, deleteEls } =
	tableStore;

initialize({
	parentId: parentId.value,
});

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
} = useTableEmpty({
	dataList,
	filters: computed(() => filtersManager.value.getAllValues()),
	error,
	isLoading,
});

const add = () => {
	return router.push({
		...route,
		params: {
			conditionId: 'new',
		},
	});
};

function setPosition(newIndex: number, list: typeof dataList.value) {
	if (newIndex === 0) {
		return {
			condDown: dataList.value[0].id,
			condUp: 0,
		};
	}

	if (newIndex === list.length - 1) {
		return {
			condDown: 0,
			condUp: dataList.value[dataList.value.length - 1].id,
		};
	}

	return {
		condDown: list[newIndex - 1].id,
		condUp: list[newIndex + 1].id,
	};
}

const handleReorder = async ({
	oldIndex,
	newIndex,
}: {
	oldIndex: number;
	newIndex: number;
}) => {
	const updatedDataList = [
		...dataList.value,
	];

	const [movedItem] = updatedDataList.splice(oldIndex, 1);
	updatedDataList.splice(newIndex, 0, movedItem);

	await DynamicConditionsAPI.patch({
		parentId: dataList.value[oldIndex].id as string,
		changes: {
			position: setPosition(newIndex, updatedDataList),
		},
	});
	await loadDataList();
};
</script>
