<template>
  <wt-page-wrapper
    class="table-page"
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        hide-primary
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #main>
      <section class="table-section">
        <header class="table-title">
          <h3 class="table-title__title">
            {{ t('lookups.contactGroups.contactGroups', 2) }}
          </h3>

          <wt-action-bar
            :include="[IconAction.ADD, IconAction.ADD_CONTACT, IconAction.REFRESH, IconAction.DELETE]"
            :disabled:add="!hasCreateAccess"
            :disabled:delete="!hasDeleteAccess || !selected.length"
            @click:add="addGroup"
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

            <template #add-contact>
              <wt-icon-action
                :disabled="!selectedStaticGroups.length"
                action="add-contact"
                @click="isShowAddContactInGroupPopup = true"
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

        <create-contact-group-popup
          :shown="isCreateGroupPopup"
          :namespace="baseNamespace"
          @close="closeCreateGroupPopup"
        />

        <div
          class="table-section__table-wrapper"
        >

          <wt-empty
            v-show="showEmpty"
            :image="imageEmpty"
            :text="textEmpty"
            :primary-action-text="primaryActionTextEmpty"
            :disabled-primary-action="!hasCreateAccess"
            @click:primary="addGroup"
          />

          <wt-loader v-show="isLoading" />

          <div v-if="dataList.length && !isLoading">
            <wt-table
              :data="dataList"
              :headers="headers"
              :selected="selected"
              sortable
              @sort="sort"
              @update:selected="setSelected"
            >
              <template #name="{ item }">
                <wt-item-link
                  :link="{ name: `${CrmSections.CONTACT_GROUPS}-card`, params: { id: item.id } }"
                >
                  {{ item.name }}
                </wt-item-link>
              </template>

              <template #description="{ item }">
                {{ item.description }}
              </template>

              <template #type="{ item }">
                {{ t(`lookups.contactGroups.types.${item.type.toUpperCase()}`) }}
              </template>

              <template #contactsSize="{ item }">
                {{ item.contactsSize }}
              </template>

              <template #state="{ item, index }">
                <wt-switcher
                  :disabled="!hasUpdateAccess"
                  :value="item.enabled"
                  @change="
                    patchProperty({
                      item,
                      index,
                      prop: 'enabled',
                      value: $event,
                    })
                  "
                />
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
                  @click="askDeleteConfirmation({
                deleted: [item],
                callback: () => deleteData(item),
              })"
                />
              </template>
            </wt-table>
          </div>
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
import { WtEmpty } from '@webitel/ui-sdk/src/components/index';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup,
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup.js';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import FilterSearch from '@webitel/ui-sdk/src/modules/Filters/components/filter-search.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/store/new/modules/tableStoreModule/useTableStore.js';
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { WebitelContactsGroupType } from 'webitel-sdk';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import CreateContactGroupPopup from './create-contact-group-popup.vue';

const baseNamespace = 'configuration/lookups/contactGroups';

const { t } = useI18n();
const router = useRouter();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } = useUserAccessControl();

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
  patchProperty,
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

onUnmounted(() => {
  flushSubscribers();
});

const { close } = useClose('configuration');

const {
  showEmpty,
  image: imageEmpty,
  text: textEmpty,
  primaryActionText: primaryActionTextEmpty,
} = useTableEmpty({ dataList, filters: filtersValue, error, isLoading });

const isCreateGroupPopup = ref(false);
const isShowAddContactInGroupPopup = ref(false);
const selectedStaticGroups = computed(() => selected.value.filter((el) => el.type === WebitelContactsGroupType.STATIC));
const staticGroupIds = computed(() => selectedStaticGroups.value.map((el) => el.id));

const path = computed(() => [
  { name: t('crm'), route: '/start-page' },
  { name: t('startPage.configuration.name'), route: '/configuration' },
  { name: t('lookups.lookups'), route: '/configuration' },
  { name: t('lookups.contactGroups.contactGroups', 2) },
]);

function edit(item) {
  return router.push({
    name: `${CrmSections.CONTACT_GROUPS}-card`,
    params: { id: item.id },
  });
}

function addGroup() {
  isCreateGroupPopup.value = true;
}

function closeCreateGroupPopup() {
  isCreateGroupPopup.value = false;
}
</script>

<style lang="scss" scoped>
</style>
