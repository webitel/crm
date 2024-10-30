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
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>

    <template #main>
      <delete-confirmation-popup
        :shown="isDeleteConfirmationPopup"
        :callback="deleteCallback"
        :delete-count="deleteCount"
        @close="closeDelete"
      />

      <section class="table-section">
        <header class="table-title">
          <h3 class="table-title__title">
            {{ t('lookups.sources.caseSources') }}
          </h3>
          <div class="table-title__actions-wrap">
            <filter-search
              :namespace="filtersNamespace"
              name="name"
            />
            <wt-icon-action
              class="table-title__action--add"
              action="add"
              :disabled="!hasObacEditAccess"
              @click="create"
            />
            <wt-icon-action
              action="refresh"
              @click="loadData"
            />
            <delete-all-action
              class="table-title__action--delete"
              v-if="hasObacDeleteAccess"
              :disabled="anySelected"
              :selected-count="selectedRows.length"
              @click="askDeleteConfirmation({
                deleted: selectedRows,
                callback: () => deleteData(selectedRows),
              })"
            />
          </div>
        </header>

        <wt-loader v-show="isLoading" />

        <!--       TODO Повернути dummy-->

        <div
          class="table-section__table-wrapper"
          v-show="dataList.length"
        >
          <wt-table
            :data="dataList"
            :headers="headers"
            sortable
            @sort="sort"
          >
            <template #name="{ item }">
              <wt-item-link
                :link="{ name: `${CrmConfigurationSections.SOURCES}-card`, params: { id: item.id } }"
              >
                {{ item.name }}
              </wt-item-link>
            </template>
            <template #actions="{ item }">
              <wt-item-link
                :link="{ name: `${CrmConfigurationSections.SOURCES}-card`, params: { id: item.id } }"
              >
                <wt-icon-action action="edit" />
              </wt-item-link>
              <wt-icon-action
                class="table-action"
                v-if="hasObacDeleteAccess"
                action="delete"
                @click="askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteData(item),
                })"
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
  import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
  import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
  import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
  import CrmConfigurationSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmConfigurationSections.enum';
  import variableSearchValidator from '@webitel/ui-sdk/src/validators/variableSearchValidator/variableSearchValidator';
  import DeleteConfirmationPopup
    from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
  import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
  import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
  import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';
  import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
  import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';

  import { computed, onUnmounted, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { useStore } from 'vuex';

  import { useAccess } from '../../../../../../../app/composables/useAccess';
  import RouteNames from '../../../../../../../app/router/_internals/RouteNames.enum';

  const baseNamespace = 'sources';

  const { t } = useI18n();
  const router = useRouter();
  const store = useStore();

  const {
    hasObacEditAccess,
    hasObacDeleteAccess,
  } = useAccess();

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
    loadData,
    deleteData,
    sort,
    setSelected,
    onFilterEvent,
  } = useTableStore(baseNamespace);

  const {
    namespace: filtersNamespace,
    restoreFilters,
    subscribe,
    flushSubscribers,
  } = useTableFilters(namespace);

  const {
    resetState
  } = useCardStore(baseNamespace);

  subscribe({
    event: '*',
    callback: onFilterEvent,
  });

  restoreFilters();

  const routeName = ref(`${RouteNames.SOURCES}`);

  const path = computed(() => [
    {
      name: t('crm'),
      route: '/start-page',
    },
    {
      name: t('lookups.contactGroups.configurations'),
      route: '/configuration',
    },
    {
      name: t('lookups.lookups'),
    },
    {
      name: t('lookups.sources.caseSources'),
      route: '/lookups/sources',
    },
  ]);

  const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

  const anySelected = computed(() => {
    return !selectedRows.value.length;
  });
  const selectedRows = computed(() => {
    return dataList.value.filter((item) => item._isSelected);
  });

  const deletableSelectedItems = computed(() =>
    selected.value.filter((item) => item.access.delete),
  );

  function create() {
    router.push({ name: `${routeName.value}-card`, params: { id: 'new' } });
  }

  function deleteSelectedItems() {
    return askDeleteConfirmation({
      deleted: deletableSelectedItems.value,
      callback: () => deleteData([...deletableSelectedItems.value]),
    });
  }

  function goBack() {
    router.push({ name: 'configuration' });
  }

  const { close } = useClose('configuration');

  onUnmounted(() => {
    flushSubscribers();
    resetState();
  });
</script>
