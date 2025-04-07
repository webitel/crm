<template>
  <wt-page-wrapper
    class="cases table-page"
    :actions-panel="showActionsPanel"
  >
    <template #header>
      <wt-page-header
        :secondary-action="close"
        hide-primary
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #actions-panel>
<!--      <cases-filters @hide="showActionsPanel = false" />-->
    </template>
    <template #main>
      <delete-confirmation-popup
        :callback="deleteCallback"
        :delete-count="deleteCount"
        :shown="isDeleteConfirmationPopup"
        @close="closeDelete"
      />

      <cases-table-section
        :use-table-store="useCasesStore"
        :action-bar-props="{
          include: [
            IconAction.ADD,
            IconAction.REFRESH,
            IconAction.FILTERS,
            IconAction.COLUMNS,
            IconAction.DELETE,
            ],
          'disabled:delete': !hasDeleteAccess || !selected.length,
          'disabled:add': !hasCreateAccess,
          // 'v-on:click:add': () => add,
          // 'v-on:click:refresh': () => loadDataList,
          // 'v-on:click:delete': () => deleteSelectedItems,
          // 'v-on:click:filters': () => showActionsPanel = !showActionsPanel,
        }"
        :table-props="{
        }"
      >
        <template
          #empty="emptyProps"
        >
          <wt-empty
            v-bind="emptyProps"
          />
        </template>

        <template #table:actions="{ item }">
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
      </cases-table-section>
    </template>
  </wt-page-wrapper>
</template>

<script lang="ts" setup>
import {CrmSections} from '@webitel/ui-sdk/enums';
import {WtEmpty} from '@webitel/ui-sdk/src/components/index';
import {useClose} from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import {IconAction} from '@webitel/ui-sdk/src/enums/index.js';
import DeleteConfirmationPopup
  from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import {
  useDeleteConfirmationPopup
} from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import {storeToRefs} from 'pinia';
import {computed, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';

import {useUserAccessControl} from '../../../app/composables/useUserAccessControl';
import CasesTableSection from "../../_shared/modules/cases/components/cases-table-section.vue";
import CasesFilters from '../filters/cases-filters.vue';
import {useCasesStore} from '../stores/cases.ts';

const {t} = useI18n();
const router = useRouter();

const store = useStore();

const {hasCreateAccess, hasUpdateAccess, hasDeleteAccess} =
  useUserAccessControl();

const {close} = useClose('the-start-page');

const tableStore = useCasesStore();

const {
  selected,
} = storeToRefs(tableStore);

const {
  loadDataList,
  deleteEls,
} = tableStore;

const {
  isVisible: isDeleteConfirmationPopup,
  deleteCount,
  deleteCallback,
  askDeleteConfirmation,
  closeDelete,
} = useDeleteConfirmationPopup();

const showActionsPanel = ref(true);

const path = computed(() => [
  {name: t('crm'), route: '/start-page'},
  {
    name: t('cases.case', 2),
  },
]);

function add() {
  return router.push({
    name: `${CrmSections.CASES}-card`,
    params: {id: 'new'},
  });
}

function edit(item) {
  const baseNamespace = 'cases';

  /*
  at "edit", only(!) store state is used to determine read/edit mode
  because store is much reliable as the state source, comparing to url query
   */
  store.dispatch(`${baseNamespace}/card/TOGGLE_EDIT_MODE`, true);
  return router.push({
    name: `${CrmSections.CASES}-card`,
    params: {id: item.id},
  });
}

function deleteSelectedItems() {
  return askDeleteConfirmation({
    deleted: selected.value,
    callback: () => deleteEls([...selected.value]),
  });
}
</script>

<style lang="scss" scoped>

</style>
