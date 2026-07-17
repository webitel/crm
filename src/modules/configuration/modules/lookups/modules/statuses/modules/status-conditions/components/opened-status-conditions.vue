<template>
  <section class="table-page opened-status-conditions">
    <condition-popup
      @load-data="loadDataList"
    />

    <opened-status-condition-warning-popup
      :shown="isStatusWarningPopupOpened"
      @close="setWarningPopupState(false)"
    />

    <delete-confirmation-popup
      :shown="isDeleteConfirmationPopup"
      :delete-count="deleteCount"
      :callback="deleteCallbackWrapper"
      @close="closeDelete"
    />

    <header class="table-title">
      <h3 class="table-title__title">
        {{ t('lookups.statuses.statuses', 2) }}
      </h3>

      <wt-action-bar
        :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
        :disabled:add="!hasCreateAccess"
        :disabled:delete="!hasDeleteAccess || !selected.length"
        @click:add="add"
        @click:refresh="loadDataList"
        @click:delete="
          askDeleteConfirmation({
            deleted: selected,
            callback: () => deleteEls(selected),
          })
        "
      >
        <template #search-bar>
          <dynamic-filter-search
            :filters-manager="filtersManager"
            @filter:add="addFilter"
            @filter:update="updateFilter"
            @filter:delete="deleteFilter"
          />
        </template>
      </wt-action-bar>
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
        :selected="selected"
        sortable
        @sort="updateSort"
        @update:selected="updateSelected"
      >
        <template #name="{ item }">
          {{ item.name }}
        </template>

        <template #description="{ item }">
          {{ item.description }}
        </template>

        <template #initial="{ item, index }">
          <wt-switcher
            :disabled="!hasUpdateAccess"
            :model-value="item.initial"
            @update:model-value="changeInitialStatus({ item, index, value: $event })"
          />
        </template>

        <template #final="{ item, index }">
          <wt-switcher
            :disabled="!hasUpdateAccess"
            :model-value="item.final"
            @update:model-value="changeFinalStatus({ item, index, value: $event })"
          />
        </template>

        <template #actions="{ item }">
          <wt-icon-action
            action="edit"
            :disabled="!hasUpdateAccess"
            @click="
              router.push({
                name: route.name,
                params: { ...route.params, statusConditionId: item.id },
                query: route.query,
              })
            "
          />

          <wt-icon-action
            action="delete"
            :disabled="!hasDeleteAccess"
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
import { CaseStatusConditionsAPI } from '@webitel/api-services/api';
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { WtEmpty } from '@webitel/ui-sdk/components';
import { IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { useCaseStatusConditionsDatalistStore } from '../stores';
import ConditionPopup from './opened-status-condition-popup.vue';
import OpenedStatusConditionWarningPopup from './opened-status-condition-warning-popup.vue';

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
	useUserAccessControl({
		useUpdateAccessAsAllMutableChecksSource: true,
	});

const parentId = computed(() => route.params.id as string);

const isStatusWarningPopupOpened = ref(false);

const tableStore = useCaseStatusConditionsDatalistStore();

const {
	dataList,
	selected,
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
	updateSelected,
	updatePage,
	updateSize,
	updateSort,
	deleteEls,
	addFilter,
	updateFilter,
	deleteFilter,
} = tableStore;

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

const add = () => {
	return router.push({
		name: route.name,
		params: {
			...route.params,
			statusConditionId: 'new',
		},
		query: route.query,
	});
};

async function deleteCallbackWrapper() {
	try {
		await deleteCallback.value();
	} catch (error) {
		if (Array.isArray(error)) {
			const isInitialOrFinalStatusDeleted = error.find(
				(err) => err?.reason?.status === 400,
			);

			setWarningPopupState(!!isInitialOrFinalStatusDeleted);
		} else {
			setWarningPopupState(error.status === 400);
		}
	}
}

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

async function setWarningPopupState(value) {
	isStatusWarningPopupOpened.value = value;

	if (!value) {
		await loadDataList();
	}
}

async function changeInitialStatus({ item, index, value }) {
	try {
		dataList.value.forEach((el) => {
			el.initial = false;
		});
		dataList.value[index].initial = value;
		await CaseStatusConditionsAPI.patch({
			id: item.id,
			parentId: parentId.value,
			changes: {
				initial: value,
			},
		});
	} catch (err) {
		if (err.status !== 400) return;
		setWarningPopupState(true);
	}
}

async function changeFinalStatus({ item, index, value }) {
	try {
		dataList.value[index].final = value;
		await CaseStatusConditionsAPI.patch({
			id: item.id,
			parentId: parentId.value,
			changes: {
				final: value,
			},
		});
	} catch (err) {
		if (err.status !== 400) return;
		setWarningPopupState(true);
	}
}
</script>

<style lang="scss" scoped>
.opened-status-conditions__priorities {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
