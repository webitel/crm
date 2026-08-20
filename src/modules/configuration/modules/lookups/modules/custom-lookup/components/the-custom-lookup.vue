<template>
  <wt-page-wrapper
    class="table-page"
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        :secondary-action="close"
        hide-primary
      >
        <wt-breadcrumb :path="path" />
      </wt-page-header>
    </template>
    <template #main>
      <upload-custom-lookup-popup
        v-if="headers.length"
        :file="csvFile"
        :fields="headers"
        :repo="repo"
        @close="closeCSVPopup"
      />
      <section class="table-section">
        <header class="table-title">
          <h3 class="table-title__title">
            {{ t('customization.customLookups.allValues') }}
          </h3>

          <wt-action-bar
            :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:add="!hasCreateAccess"
            :disabled:delete="!hasDeleteAccess || !selected.length"
            @click:refresh="loadDataList"
            @click:add="add"
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
                single-search-name="search"
                @filter:add="addFilter"
                @filter:update="updateFilter"
                @filter:delete="deleteFilter"
              />
              <wt-upload-file-icon-btn
                v-if="hasCreateAccess"
                accept=".csv"
                class="icon-action"
                @change="processCSV"
              />
            </template>
          </wt-action-bar>
        </header>

        <delete-confirmation-popup
          :shown="isDeleteConfirmationPopup"
          :callback="deleteCallback"
          :delete-count="deleteCount"
          @close="closeDelete"
        />

        <div class="table-section__table-wrapper">
          <wt-empty
            v-show="showEmpty"
            :image="imageEmpty"
            :headline="emptyHeadline"
            :title="emptyTitle"
            :text="textEmpty"
            :primary-action-text="emptyPrimaryActionText"
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
            <template
              v-for="header in shownHeaders"
              :key="header.value"
              #[header.value]="{ item }"
            >
              <display-dynamic-field
                :field="header"
                :value="item"
              />
            </template>
            <template #actions="{ item }">
              <wt-icon-action
                action="edit"
                :disabled="!hasUpdateAccess"
                @click="edit(item)"
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
  </wt-page-wrapper>
</template>

<script lang="ts" setup>
import { AdjunctTypesAPI } from '@webitel/api-services/api';
import type { DataInputDictionary } from '@webitel/api-services/gen/models';
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { WtEmpty } from '@webitel/ui-sdk/components';
import WtUploadFileIconBtn from '@webitel/ui-sdk/components/on-demand/wt-upload-file-icon-btn/wt-upload-file-icon-btn.vue';
import { useClose } from '@webitel/ui-sdk/composables';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { customLookupFields } from '../stores/_internals/customLookupFields';
import { useCustomLookupDatalistStore } from '../stores/datalist/customLookupDatalistStore';
import { buildCustomLookupHeaders } from '../utils/buildCustomLookupHeaders';
import DisplayDynamicField from './display-dynamic-field.vue';
import UploadCustomLookupPopup from './upload-custom-lookup-popup.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const repo = computed(() => route.params.repo as string);
const dictionary = ref<DataInputDictionary | null>(null);

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
	useUserAccessControl();

const {
	isVisible: isDeleteConfirmationPopup,
	deleteCount,
	deleteCallback,

	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const tableStore = useCustomLookupDatalistStore();

const {
	dataList,
	selected,
	error,
	isLoading,
	page,
	size,
	next,
	headers,
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
	updateShownHeaders,
	resetInfiniteScrollTableParamsToDefaults,
} = tableStore;

// the `:repo` route param is shared by every custom-lookup dictionary (same
// route record), so switching dictionaries does NOT remount this component —
// re-fetch the schema and re-init the store explicitly on every repo change
watch(
	repo,
	async (newRepo) => {
		if (!newRepo) return;

		resetInfiniteScrollTableParamsToDefaults();

		dictionary.value = await AdjunctTypesAPI.get({
			itemId: newRepo,
		});
		customLookupFields.value = dictionary.value?.fields ?? [];
		updateShownHeaders(buildCustomLookupHeaders(customLookupFields.value));

		await initialize({
			parentId: newRepo,
		});
	},
	{
		immediate: true,
	},
);

const path = computed(() => [
	{
		name: t('crm'),
		route: '/start-page',
	},
	{
		name: t('startPage.configuration.name'),
		route: '/configuration',
	},
	{
		name: t('lookups.lookups'),
		route: '/configuration',
	},
	{
		name: dictionary.value?.name,
	},
]);

const { close } = useClose('configuration');

const {
	showEmpty,
	image: imageEmpty,
	text: textEmpty,
	headline: emptyHeadline,
	title: emptyTitle,
	primaryActionText: emptyPrimaryActionText,
} = useTableEmpty({
	dataList,
	error,
	filters: computed(() => filtersManager.value.getAllValues()),
	isLoading,
});

const csvFile = ref<File | null>(null);

const processCSV = (files: FileList) => {
	const file = files[0];
	if (file) {
		csvFile.value = file;
	}
};

const closeCSVPopup = () => {
	csvFile.value = null;
	loadDataList();
};

const add = () => {
	router.push({
		name: 'custom-lookup-record',
		params: {
			id: 'new',
		},
	});
};

const edit = (item: { id: string }) => {
	router.push({
		name: 'custom-lookup-record',
		params: {
			id: item.id,
		},
	});
};
</script>
