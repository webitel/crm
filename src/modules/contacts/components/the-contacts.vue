<template>
  <wt-page-wrapper
    class="contacts"
    :actions-panel="false"
  >
    <template v-slot:header>
      <wt-page-header
        :primary-action="create"
        :secondary-text="$t('reusable.delete')"
        :hide-primary="!hasCreateAccess"
        :hide-secondary="!hasDeleteAccess"
      >
        <wt-headline-nav :path="path"></wt-headline-nav>
      </wt-page-header>
    </template>
    <template v-slot:main>
      <wt-loader v-show="isLoading"></wt-loader>

      <div v-show="!isLoading" class="table-wrapper">
        <wt-table
          :headers="headers"
          :data="dataList"
          :grid-actions="hasEditAccess || hasDeleteAccess"
          sortable
          @sort="sort"
        >
          <template v-slot:name="{ item }">
            <wt-item-link
              :id="item.id"
              :route-name="CrmSections.CONTACTS"
            >{{ item.name.commonName }}
            </wt-item-link>
          </template>
          <template v-slot:labels="{ item }">
            <div
              v-if="item.labels"
              class="contacts-labels-wrapper"
            >
              <wt-chip
                v-for="({ label, id }) of item.labels.data"
                :key="id"
              >{{ label }}
              </wt-chip>
            </div>
          </template>
          <template v-slot:actions="{ item }">
            <wt-item-link
              :id="item.id"
              :route-name="CrmSections.CONTACTS"
            >
              <wt-icon-action
                v-if="hasEditAccess"
                action="edit"
              ></wt-icon-action>
            </wt-item-link>
            <wt-icon-action
              v-if="hasDeleteAccess"
              action="delete"
            ></wt-icon-action>
          </template>
        </wt-table>
        <filter-pagination
          :namespace="filtersNamespace"
          :is-next="isNext"
        ></filter-pagination>
      </div>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { useAccess } from '../../../app/composables/useAccess';

const baseNamespace = 'contacts';

const { t } = useI18n();
const router = useRouter();

const {
  namespace,

  dataList,
  isLoading,
  headers,
  isNext,
  error,

  deleteData,
  sort,
} = useTableStore(baseNamespace);

const {
  hasCreateAccess,
  hasEditAccess,
  hasDeleteAccess,
} = useAccess();

const { filtersNamespace } = useTableFilters(namespace);

const path = computed(() => [
  { name: t('contacts.contact', 2), route: '/' },
]);

function create() {
  return router.push({ name: `${CrmSections.CONTACTS}-new` });
}
</script>

<style lang="scss" scoped>
.contacts {
  max-height: 100%;

  :deep(.wt-page-wrapper__main) {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    min-height: 0;
  }

  .table-wrapper {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    max-height: 100%;
    min-height: 0;
  }

  .wt-table {
    flex-grow: 1;

    :deep(.wt-table__head) {
      position: sticky;
      top: 0;
      z-index: 1;
    }
  }
}

.contacts-labels-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-2xs);
}
</style>
