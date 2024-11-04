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
            <wt-action-bar
              :actions="tableActions"
              mode="table"
              @click:add="create"
              @click:refresh="loadData"
            >
              <template #search-bar>
                <filter-search
                  :namespace="filtersNamespace"
                  name="name"
                />
              </template>
              <template #delete>
                <delete-all-action
                  :disabled="!selected.length"
                  :selected-count="selected.length"
                  @click="askDeleteConfirmation({
                  deleted: selected,
                  callback: () => deleteData(selected),
                 })"
                />
              </template>
            </wt-action-bar>
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
                :link="linkToCard(item.id)"
              >
                {{ item.name }}
              </wt-item-link>
            </template>
            <template #actions="{ item }">
              <wt-item-link
                :link="linkToCard(item.id)"
              >
                <wt-icon-action action="edit" />
              </wt-item-link>
              <wt-icon-action
                v-if="hasObacDeleteAccess"
                class="table-action"
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
  import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum';
  import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
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
    resetState,
  } = useCardStore(baseNamespace);

  const tableActions = [
    IconAction.ADD,
    IconAction.REFRESH,
  ];

  subscribe({
    event: '*',
    callback: onFilterEvent,
  });

  onUnmounted(() => {
    flushSubscribers();
    resetState();
  });

  restoreFilters();

  const routeName = ref(`${RouteNames.SOURCES}`);

  const path = computed(() => [
    {
      name: t('crm'),
      route: '/start-page',
    },
    {
      name: t('lookups.contactGroups.configurations'), // локалка буде існувати в наступних комітах
      route: '/configuration',
    },
    {
      name: t('lookups.lookups'), // локалка буде існувати в наступних комітах
      route: '/configuration',
    },
    {
      name: t('lookups.sources.caseSources'), // локалка буде існувати в наступних комітах
      route: '/lookups/sources',
    },
  ]);

  const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

  const { close } = useClose('configuration');

  function create() {
    router.push({ name: `${routeName.value}-card`, params: { id: 'new' } });
  }
  function linkToCard(id){
    return { name: `${CrmSections.SOURCES}-card`, params: { id } }
  }
</script>
