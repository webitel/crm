<template>
  <wt-page-wrapper
    :actions-panel="false"
    class="contacts"
  >
    <template #header>
      <wt-page-header
        hide-primary
        :secondary-action="close"
        :secondary-text="$t('reusable.close')"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #main>

      <delete-confirmation-popup
        :callback="deleteCallback"
        :delete-count="deleteCount"
        :shown="isDeleteConfirmationPopup"
        @close="closeDelete"
      />

      <section class="main-section__wrapper">
        <header class="content-header">
          <h3 class="content-title">
            {{ $t('cases.case', 2) }}
          </h3>
          <div class="content-header__actions-wrap">
            <wt-search-bar
            />
            <wt-table-actions
              :icons="['refresh']"
            >
              <wt-icon-btn
                icon="plus"
              />
              <wt-icon-btn
                icon="filter"
              />
              <wt-icon-btn
                icon="column-select"
              />
              <wt-icon-btn
                v-if="selected.length"
                class="icon-action"
                icon="bucket"
                @click="deleteSelectedItems"
              />
            </wt-table-actions>
          </div>
        </header>
        <wt-loader v-show="isLoading" />

        <wt-dummy
          v-if="!isLoading && !dataList.length"
          :dark-mode="darkMode"
          :src="dummy.src"
          :text="dummy.text"
        />
        <div
          v-show="!isLoading && dataList.length"
          class="table-wrapper"
        >
          <wt-table
            :data="dataList"
            :headers="headers"
            :selected="selected"
            sortable
            @sort="sort"
            @update:selected="setSelected"
          >
            <template #name="{ item }">
              {{ item.name }}
            </template>
            <template #priority="{ item }">
              {{ item.priority.name }}
            </template>
            <template #status="{ item }">
              {{ item.status.name }}
            </template>
            <template #source="{ item }">
              {{ item.source.name }}
            </template>
            <template #service="{ item }">
              {{ item.service.name }}
            </template>
            <template #createdBy="{ item }">
              {{ item.createdBy.name }}
            </template>
            <template #group="{ item }">
              {{ item.group.name }}
            </template>
            <template #assignee="{ item }">
              {{ item.assignee.name }}
            </template>
            <template #reporter="{ item }">
              {{ item.reporter.name }}
            </template>
            <template #impacted="{ item }">
              {{ item.impacted.name }}
            </template>
            <template #appliedSLA="{ item }">
              {{ item.service.sla.name }}
            </template>
            <template #actualReactionTime="{ item }">
              {{ item.timing.reactedAt }}
            </template>
            <template #actualResolutionTime="{ item }">
              {{ item.timing.resolvedAt }}
            </template>
            <template #closeReason="{ item }">
              {{ item.close.closeReason.name }}
            </template>
            <template #closeResult="{ item }">
              {{ item.close.closeResult }}
            </template>
            <template #rate="{ item }">
              {{ item.rate.rating }}
            </template>
            <template #actions="{ item }">
              <wt-icon-action
                action="edit"
                @click="edit(item)"
              />
              <wt-icon-action
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
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import dummyDark from '../../../app/assets/dummy-dark.svg';
import dummyLight from '../../../app/assets/dummy-light.svg';

const baseNamespace = 'cases';

const { t } = useI18n();
const router = useRouter();

const store = useStore();

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


const path = computed(() => [
  { name: t('crm') },
  { name: t('cases.case', 2), route: '/' },
]);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);
const dummyPic = computed(() => (darkMode.value ? dummyDark : dummyLight));

// we need to check if there's any filters which actually filter data before showing "no data" dummy

// [WTEL-3776]
// display different images when no contacts have been created yet (default img)
// and when the filter didn't produce results
const dummy = computed(() => {
  if (dataList.value.length) return false;
  const filters = store.getters[`${filtersNamespace}/_STATE_FILTER_NAMES`];
  const defaultFilters = ['page', 'size', 'sort', 'fields'];
  const dynamicFilters = Object.keys(filters)
  .reduce((dynamic, filter) => {
    if (defaultFilters.includes(filter)) return dynamic;
    return {
      ...dynamic,
      [filter]: filters[filter],
    };
  }, {});
  const isEmptyFilters = isEmpty(dynamicFilters);

  return {
    src: isEmptyFilters ? '' : dummyPic.value,
    text: isEmptyFilters ? '' : t('vocabulary.emptyResultSearch'),
  };
});

function saved(id) {
  return router.push({
    // TODO: Use CrmSections.CASES instead of 'cases'
    name: `cases-card`,
    params: { id },
  });
}

function deleteSelectedItems() {
  return askDeleteConfirmation({
    deleted: selected.value,
    callback: () => deleteData([...selected.value]),
  });
}

function close(){
  if(window.history.length===1)return window.close();
  return router.push('/start-page');
}

</script>

<style lang="scss" scoped>

.main-section__wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
// SECTION HEADING
.content-header {
  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: var(--spacing-sm) 0;

  .content-title {
    @extend %typo-heading-3;

    + .hint {
      top: -2px;
    }
  }

  // WRAP FOR SEARCH INPUT
  .content-header__actions-wrap {
    display: flex;
    align-items: center;
    gap: var(--table-actions-icon-gap);
  }
}



// make action icons fixed to right
.wt-table ::v-deep .wt-table__tr {
  .wt-table__td__actions {
    position: sticky;
    right: 0;
    background: var(--content-wrapper-color);
  }

  &:nth-child(2n) {
    .wt-table__td__actions {
      background: var(--wt-table-zebra-color);
    }
  }
}
</style>
