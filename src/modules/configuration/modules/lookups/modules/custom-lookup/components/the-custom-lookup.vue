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
        :key="repo"
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
            :disabled:delete="!selected.length"
            @click:refresh="loadData"
            @click:add="add"
            @click:delete="
              askDeleteConfirmation({
                deleted: selected,
                callback: () => deleteData(selected),
              })
            "
          >
            <template #search-bar>
              <filter-search
                :namespace="filtersNamespace"
                name="search"
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
            :headers="headers"
            :selected="selected"
            sortable
            @sort="sort"
            @update:selected="setSelected"
          >
            <template
              v-for="header in headers"
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
                    callback: () => deleteData(item),
                  })
                "
              />
            </template>
          </wt-table>

          <filter-pagination
            :namespace="filtersNamespace"
            :is-next="isNext"
          />
        </div>
      </section>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { WtEmpty } from '@webitel/ui-sdk/components';
import { WtObject } from '@webitel/ui-sdk/enums';
import { SortSymbols } from '@webitel/ui-sdk/scripts/sortQueryAdapters.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

import WtUploadFileIconBtn from '@webitel/ui-sdk/components/on-demand/wt-upload-file-icon-btn/wt-upload-file-icon-btn.vue';
import CustomLookupsApi from '../../../../../../customization/modules/custom-lookups/api/custom-lookups.js';
import { FieldType } from '../../../../../../customization/modules/custom-lookups/enums/FieldType.js';
import DisplayDynamicField from './display-dynamic-field.vue';
import UploadCustomLookupPopup from './upload-custom-lookup-popup.vue';

const baseNamespace = 'configuration/lookups/customLookup';

const { t } = useI18n();
const router = useRouter();

const store = useStore();

const route = useRoute();

const dictionary = ref(null);
const repo = ref(route.params.repo);

const loadDictionary = async () => {
	try {
		dictionary.value = await CustomLookupsApi.get({
			itemId: repo.value,
		});

		store.commit(`${baseNamespace}/table/SET`, {
			path: 'headers',
			value: dictionary.value.fields
				.filter((field) => !field.hidden && field.id !== 'id')
				.map((field) => ({
					value: field.id,
					locale: field.name,
					readonly: field.readonly,
					show: true,
					field: field.id,
					kind: field.kind,
					sort:
						field.kind === FieldType.Multiselect ? undefined : SortSymbols.NONE,
				})),
		});
	} catch (e) {
		console.error(e);
	}
};

store.commit(`${baseNamespace}/table/SET`, {
	path: 'repo',
	value: repo.value,
});

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
	useUserAccessControl(WtObject.CustomLookup);

const {
	isVisible: isDeleteConfirmationPopup,
	deleteCount,
	deleteCallback,

	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const {
	namespace,

	dataList,
	selected,
	isLoading,
	headers,
	isNext,
	error,

	loadData,
	deleteData,
	sort,
	setSelected,
	onFilterEvent,
} = useTableStore(baseNamespace);

const {
	namespace: filtersNamespace,
	restoreFilters,
	filtersValue,

	subscribe,
	flushSubscribers,
} = useTableFilters(namespace);

subscribe({
	event: '*',
	callback: onFilterEvent,
});

restoreFilters();

onMounted(async () => {
	await loadDictionary();
});

onUnmounted(() => {
	flushSubscribers();
});

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
	filters: filtersValue,
	isLoading,
});

const csvFile = ref(null);

const processCSV = (files) => {
	const file = files[0];
	if (file) {
		csvFile.value = file;
	}
};

const closeCSVPopup = () => {
	csvFile.value = null;
	loadData();
};

const add = () => {
	router.push({
		name: 'custom-lookup-record',
		params: {
			id: 'new',
		},
	});
};

const edit = (item) => {
	router.push({
		name: 'custom-lookup-record',
		params: {
			id: item.id,
		},
	});
};
</script>
