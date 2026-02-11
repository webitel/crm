<template>
  <wt-page-wrapper
    class="cases table-page"
    :actions-panel="showActionsPanel && !isInitialEmpty"
    :hide-header="true"
  >
    <template #actions-panel>
      <cases-filters-panel @hide="showActionsPanel = false" />
    </template>
    <template #main>
      <delete-confirmation-popup
        :callback="deleteCallback"
        :delete-count="deleteCount"
        :shown="isDeleteConfirmationPopup"
        @close="closeDelete"
      />

      <section class="table-section">
        <header class="table-title">
          <wt-breadcrumb :path="path" />

          <cases-filter-search-bar
            v-if="!isInitialEmpty"
            class="cases__search-filter"
          />

          <wt-action-bar
            :include="displayIncludeActions"
            :disabled:delete="!hasDeleteAccess || !selected.length"
            :disabled:add="!hasCreateAccess"
            @click:add="add"
            @click:refresh="loadDataList"
            @click:delete="deleteSelectedItems"
            @click:filters="showActionsPanel = !showActionsPanel"
          >
            <template #filters="{ action, onClick }">
              <wt-badge :hidden="!anyFiltersOnFiltersPanel">
                <wt-icon-action
                  :action="action"
                  @click="onClick"
                />
              </wt-badge>
            </template>
            <template #columns>
              <wt-table-column-select
                :headers="mergedHeaders"
                @change="updateShownHeaders"
              />
            </template>
          </wt-action-bar>
        </header>
        <wt-loader v-show="isLoading" />

        <wt-empty
          v-if="showEmpty"
          :image="emptyImage"
          :headline="emptyHeadline"
          :title="emptyTitle"
          :text="emptyText"
          :primary-action-text="emptyPrimaryActionText"
          :disabled-primary-action="!hasCreateAccess"
          @click:primary="add"
        />

        <div
          v-show="!isLoading && dataList?.length"
          class="table-section__table-wrapper"
        >
          <wt-table
            :data="dataList"
            :headers="shownHeaders"
            :selected="selected"
            :row-class="rowClass"
            fixed-actions
            sortable
            row-expansion
            resizable-columns
            reorderable-columns
            :row-expansion-disabled="isRowExpansionDisabled"
            @column-resize="columnResize"
            @column-reorder="columnReorder"
            @sort="updateSort"
            @update:selected="updateSelected"
          >
            <template #name="{ item }">
              <wt-item-link
                class="cases__link-name"
                :link="{
                  name: `${CrmSections.Cases}-card`,
                  params: { id: item?.id },
                }"
              >
                <div class="cases__link-content">
                  <color-component-wrapper
                    component="wt-icon"
                    :color="item?.statusCondition?.final ? 'default' : item.priority?.color"
                    :icon="item?.statusCondition?.final ? 'case-done' : 'case--filled'"
                    size="md"
                  />

                  {{ item.name }}
                </div>
              </wt-item-link>
            </template>
            <template #subject="{ item }">
              <wt-item-link :link="{
                name: `${CrmSections.Cases}-card`,
                params: { id: item?.id },
              }">
                {{ item.subject }}
              </wt-item-link>
            </template>
            <template #priority="{ item }">
              <color-component-wrapper
                :class="{ 'case-priority typo-body-1': !!item.priority?.color }"
                :color="item.priority?.color"
              >
                {{ item.priority?.name }}
              </color-component-wrapper>
            </template>
            <template #statusCondition="{ item }">
              {{ item.statusCondition?.name }}
            </template>
            <template #source="{ item }">
              <div class="cases-source">
                <wt-icon
                  color="info"
                  :icon="item?.source?.type"
                />
                <span>{{ item?.source?.name }}</span>
              </div>
            </template>
            <template #createdAt="{ item }">
              {{ prettifyDate(item.createdAt) }}
            </template>
            <template #service="{ item }">
              <service-path :service="item?.service" />
            </template>
            <template #createdBy="{ item }">
              {{ item.createdBy?.name }}
            </template>
            <template #group="{ item }">
              {{ item.group?.name }}
            </template>
            <template #assignee="{ item }">
              {{ item.assignee?.name }}
            </template>
            <template #reporter="{ item }">
              {{ item.reporter?.name }}
            </template>
            <template #impacted="{ item }">
              {{ item.impacted?.name }}
            </template>
            <template #appliedSLA="{ item }">
              {{ item.sla?.name }}
            </template>
            <template #slaCondition="{ item }">
              {{ item.slaCondition?.name }}
            </template>
            <template #plannedReactionAt="{ item }">
              {{ prettifyDate(item.plannedReactionAt) }}
            </template>
            <template #plannedResolveAt="{ item }">
              {{ prettifyDate(item.plannedResolveAt) }}
            </template>
            <template #actualReactionTime="{ item }">
              {{ prettifyDate(item.reactedAt) }}
            </template>
            <template #actualResolutionTime="{ item }">
              {{ prettifyDate(item.resolvedAt) }}
            </template>
            <template #closeReason="{ item }">
              {{ item.closeReason?.name }}
            </template>
            <template #closeResult="{ item }">
              {{ item.closeResult }}
            </template>
            <template #rating="{ item }">
              {{ item.rating }}
            </template>
            <template
              v-for="header in customHeaders"
              #[header.value]="{ item }"
              :key="header.field"
            >
              <display-dynamic-field-extension
                :field="header"
                :value="getCustomValues(item, header)"
              />
            </template>
            <template #expansion="{ item }">
              <case-details-table :item="item" />
            </template>
            <template #actions="{ item }">
              <wt-icon-action
                :disabled="!hasUpdateAccess"
                action="edit"
                @click="edit(item)"
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
  </wt-page-wrapper>
</template>

<script setup>
import { WtTypeExtensionAPI } from '@webitel/api-services/api';
import { snakeToCamel } from '@webitel/api-services/utils';
import { WtEmpty, WtTable } from '@webitel/ui-sdk/components';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections, IconAction } from '@webitel/ui-sdk/enums';
import { EmptyCause } from '@webitel/ui-sdk/enums/EmptyCause/EmptyCause';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import get from 'lodash/get';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

import ColorComponentWrapper from '../../../app/components/utils/color-component-wrapper.vue';
import { useUserAccessControl } from '../../../app/composables/useUserAccessControl';
import { FieldType } from '../../customization/modules/custom-lookups/enums/FieldType';
import DisplayDynamicFieldExtension from '../../customization/modules/wt-type-extension/components/display-dynamic-field-extension.vue';
import { SearchMode } from '../enums/SearchMode';
import ServicePath from '../modules/service/components/service-path.vue';
import { useCasesStore } from '../stores/cases.ts';
import prettifyDate from '../utils/prettifyDate.js';
import CaseDetailsTable from './case-details-table.vue';
import CasesFilterSearchBar from './cases-filter-search-bar.vue';
import CasesFiltersPanel from './cases-filters-panel.vue';

const baseNamespace = 'cases';

const { t } = useI18n();
const router = useRouter();

const store = useStore();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
	useUserAccessControl();

const tableStore = useCasesStore();

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
	updateShownHeaders,
	columnResize,
	columnReorder,
} = tableStore;

const {
	isVisible: isDeleteConfirmationPopup,
	deleteCount,
	deleteCallback,
	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const {
	showEmpty,
	emptyCause,
	image: emptyImage,
	headline: emptyHeadline,
	title: emptyTitle,
	text: emptyText,
	primaryActionText: emptyPrimaryActionText,
} = useTableEmpty({
	dataList,
	error,
	filters: computed(() => filtersManager.value.getAllValues()),
	isLoading,
});

const showActionsPanel = ref(true);

const isInitialEmpty = ref(false);

const displayIncludeActions = computed(() => {
	const baseActions = [
		IconAction.ADD,
		IconAction.REFRESH,
		IconAction.FILTERS,
		IconAction.COLUMNS,
		IconAction.DELETE,
	];

	return isInitialEmpty.value
		? [
				IconAction.ADD,
			]
		: baseActions;
});

/*
 * show "toggle filters panel" badge if any filters are applied...
 * */
const anyFiltersOnFiltersPanel = computed(() => {
	/*
	 * ...excluding search filters, which shown in other panel
	 * */
	return filtersManager.value.getAllKeys().some((filterName) => {
		return !Object.values(SearchMode).some((mode) => mode === filterName);
	});
});

const path = computed(() => [
	{
		name: t('crm'),
		route: '/start-page',
	},
	{
		name: t('cases.case', 2),
	},
]);

function add() {
	return router.push({
		name: `${CrmSections.Cases}-card`,
		params: {
			id: 'new',
		},
	});
}

function edit(item) {
	/*
  at "edit", only(!) store state is used to determine read/edit mode
  because store is much reliable as the state source, comparing to url query
   */
	store.dispatch(`${baseNamespace}/card/TOGGLE_EDIT_MODE`, true);
	return router.push({
		name: `${CrmSections.Cases}-card`,
		params: {
			id: item.id,
		},
	});
}

function deleteSelectedItems() {
	return askDeleteConfirmation({
		deleted: selected.value,
		callback: () =>
			deleteEls([
				...selected.value,
			]),
	});
}

// Reactive reference for custom headers from API
const customHeaders = ref([]);
const customHeadersLoaded = ref(false);

// Computed property that combines base headers with custom headers
const mergedHeaders = computed(() => {
	const baseHeaders = headers.value || [];

	// Return only base headers if custom headers aren't loaded yet
	if (!customHeadersLoaded.value) {
		return baseHeaders;
	}

	// Get unique custom headers that don't conflict with base headers
	const uniqueCustomHeaders = filterUniqueHeaders(
		customHeaders.value,
		baseHeaders,
	);

	return [
		...baseHeaders,
		...uniqueCustomHeaders,
	];
});

// Helper function to filter out duplicate headers based on field property
const filterUniqueHeaders = (headersToFilter, existingHeaders) => {
	const existingFields = new Set(existingHeaders.map((header) => header.field));
	return headersToFilter.filter((header) => !existingFields.has(header.field));
};

// Helper function to transform API field objects into table header format
const transformFieldsToHeaders = (fields) => {
	if (!Array.isArray(fields)) return [];

	return fields.map((field) => createHeaderFromField(field));
};

// Helper function to create a single header object from API field data
const createHeaderFromField = (field) => ({
	value: snakeToCamel(field?.name),
	show: false,
	kind: field.kind,
	field: field.id,
	locale: field.name,
});

// Helper function to extract custom field value from item data
const getCustomValues = (item, header) => {
	// Boolean fields are stored by field ID, other fields by field (camelCase)
	return get(item, [
		'custom',
		header.field,
	]);
};

// Helper function to fetch custom headers from API
const fetchCustomHeadersFromAPI = async () => {
	const response = await WtTypeExtensionAPI.getList({
		itemId: 'cases',
	});
	return response?.fields || [];
};

// Helper function to merge headers and update store
const updateHeaders = (headersToAdd, baseHeaders) => {
	const existingHeaders = baseHeaders || headers.value || [];
	const uniqueHeaders = filterUniqueHeaders(headersToAdd, existingHeaders);

	if (uniqueHeaders.length) {
		const mergedHeaders = [
			...existingHeaders,
			...uniqueHeaders,
		];
		updateShownHeaders(mergedHeaders);
	}
};

// Main function to load and integrate custom headers
const loadCustomHeaders = async () => {
	// Fetch fields from API
	const fields = await fetchCustomHeadersFromAPI();

	// Transform API fields to header format
	const transformedHeaders = transformFieldsToHeaders(fields);
	customHeaders.value = transformedHeaders;
	customHeadersLoaded.value = true;

	// Merge with existing headers and update store if we have any custom headers
	if (transformedHeaders.length) {
		updateHeaders(transformedHeaders);
	}
};

// Helper function to sync missing custom headers
const syncMissingCustomHeaders = (newHeaders) => {
	if (!customHeadersLoaded.value || !newHeaders) return;

	// Use the same merge function but with reversed parameters
	updateHeaders(customHeaders.value, newHeaders);
};

const rowClass = (item) => {
	if (item.statusCondition?.final) return 'row-success';
};

// Disable row expansion if neither 'comments' nor 'description' exist in the row data
const isRowExpansionDisabled = (row) => {
	return ![
		'comments',
		'description',
	].some((key) => Object.hasOwn(row || {}, key));
};

// Initialize headers before table store
onMounted(async () => {
	// @author @stanislav-kozak
	// Order is important
	await loadCustomHeaders();
	await initialize();
});

// Keep custom headers in sync when base headers change
watch(() => headers.value, syncMissingCustomHeaders, {
	deep: true,
});

watch(
	() => emptyCause.value,
	(newCause, oldCause) => {
		if (newCause && oldCause !== newCause && newCause === EmptyCause.EMPTY) {
			isInitialEmpty.value = true;
		}
	},
);

watch(customHeadersLoaded, (isLoaded) => {
	if (!isLoaded) return;

	// "updateHeaders" doesnt mix in custom headers if those are present (already restored) in headers
	const notInitializedHeaders = headers.value.filter(
		(header) => header.shouldBeInitialized,
	);
	if (!notInitializedHeaders.length) return;

	// ... so, we can just extend those restored (but not initialized yet) headers with custom headers
	notInitializedHeaders.forEach((header) => {
		const customHeader = customHeaders.value.find(
			(customHeader) => customHeader.field === header.field,
		);
		Object.assign(header, {
			...customHeader,
			shouldBeInitialized: false,
			show: true,
		});
	});
});
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.cases {
  .table-title {
    grid-gap: var(--spacing-xs);
  }

  &__link-content {
    display: flex;
    gap: var(--spacing-xs);
  }

  &__link-name {
    color: var(--text-link-color);
  }

  &__search-filter {
    margin-left: auto;
  }

  //TODO: typo-body-1 bold
  .case-priority {
    font-weight: bold;
  }

  .cases-source {
    display: flex;
    gap: var(--spacing-xs);
  }
}
</style>
