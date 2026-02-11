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
      <section class="table-section">
        <header class="table-title">
          <h3 class="table-title__title">
            {{ t('vocabulary.priority') }}
          </h3>

          <wt-action-bar
            :include="[IconAction.ADD, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:delete="!hasDeleteAccess || !selected.length"
            :disabled:add="!hasCreateAccess"
            @click:add="add"
            @click:refresh="loadData"
            @click:delete="askDeleteConfirmation({
              deleted: selected,
              callback: () => deleteData(selected),
            })"
          >
            <template #search-bar>
              <filter-search
                :namespace="filtersNamespace"
                name="search"
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
            :text="textEmpty"
            :primary-action-text="primaryActionTextEmpty"
            :disabled-primary-action="!hasCreateAccess"
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
            <template #name="{ item }">
              <wt-item-link :link="{ name: `${CrmSections.Priorities}-card`, params: { id: item.id } }">
                {{ item.name }}
              </wt-item-link>
            </template>

            <template #color="{ item }">
              <color-component-wrapper
                :color="item.color"
                component="wt-indicator"
              />
            </template>
            <template #description="{ item }">
              {{ item.description }}
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
                @click="askDeleteConfirmationWrapper(item)"
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
import { CrmSections } from '@webitel/ui-sdk/enums';
import { WtEmpty } from '@webitel/ui-sdk/src/components/index';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { computed, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import ColorComponentWrapper from '../../../../../../../app/components/utils/color-component-wrapper.vue';
import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

const baseNamespace = 'configuration/lookups/priorities';

const { t } = useI18n();
const router = useRouter();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
	useUserAccessControl();

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
	filtersValue,
	restoreFilters,

	subscribe,
	flushSubscribers,
} = useTableFilters(namespace);

subscribe({
	event: '*',
	callback: onFilterEvent,
});

restoreFilters();

onUnmounted(() => {
	flushSubscribers();
});

const add = () => {
	return router.push({
		name: `${CrmSections.Priorities}-card`,
		params: {
			id: 'new',
		},
	});
};

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
		name: t('vocabulary.priority', 2),
	},
]);

const { close } = useClose('configuration');

function askDeleteConfirmationWrapper(item) {
	askDeleteConfirmation({
		deleted: [
			item,
		],
		callback: () => deleteData(item),
	});
}

function edit(item) {
	return router.push({
		name: `${CrmSections.Priorities}-card`,
		params: {
			id: item.id,
		},
	});
}

const {
	showEmpty,
	image: imageEmpty,
	text: textEmpty,
	primaryActionText: primaryActionTextEmpty,
} = useTableEmpty({
	dataList,
	filters: filtersValue,
	error,
	isLoading,
});
</script>

<style
  lang="scss"
  scoped
></style>
