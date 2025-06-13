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
      <section class="table-section">
        <header class="table-title">
          <h3 class="table-title__title">
            {{ t('lookups.sources.sources', 2) }}
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
                single-search-name="q"
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

          <div v-if="dataList.length && !isLoading">
            <wt-table
              :data="dataList"
              :headers="shownHeaders"
              :selected="selected"
              sortable
              @sort="updateSort"
              @update:selected="updateSelected"
            >
              <template #name="{ item }">
                <wt-item-link
                  :link="{
                    name: `${CrmSections.SOURCES}-card`,
                    params: { id: item.id },
                  }"
                >
                  {{ item.name }}
                </wt-item-link>
              </template>

              <template #type="{ item }">
                {{ t(`lookups.sources.types.${item.type.toUpperCase()}`) }}
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
                  @click="
                    askDeleteConfirmation({
                      deleted: [item],
                      callback: () => deleteEls(item),
                    })
                  "
                />
              </template>
            </wt-table>
          </div>

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
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { WtEmpty } from '@webitel/ui-sdk/src/components/index';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose';
import IconAction from '@webitel/ui-sdk/src/enums/IconAction/IconAction.enum';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import { useCaseSourcesDatalistStore } from '../stores';

const { t } = useI18n();
const router = useRouter();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
  useUserAccessControl();

const tableStore = useCaseSourcesDatalistStore();


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
} = tableStore;

initialize();

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,

  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const path = computed(() => [
  { name: t('crm'), route: '/start-page' },
  { name: t('startPage.configuration.name'), route: '/configuration' },
  { name: t('lookups.lookups'), route: '/configuration' },
  { name: t('lookups.sources.sources', 2) },
]);

const { close } = useClose('configuration');

const add = () => {
  return router.push({
    name: `${CrmSections.SOURCES}-card`,
    params: { id: 'new' },
  })
};

function edit(item) {
  return router.push({
    name: `${CrmSections.SOURCES}-card`,
    params: { id: item.id },
  });
}


const {
  showEmpty,
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
</script>

<style lang="scss" scoped></style>
