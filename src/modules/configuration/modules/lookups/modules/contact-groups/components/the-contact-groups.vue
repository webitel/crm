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
        <wt-breadcrumb :path="path" />
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
            :disabled:add-contact="!selectedStaticGroups.length"
            :disabled:delete="!hasDeleteAccess || !selected.length"
            @click:add-contact="isShowAddContactInGroupPopup = true"
            @click:add="addGroup"
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
                @filter:add="addFilter"
                @filter:update="updateFilter"
                @filter:delete="deleteFilter"
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
          @close="closeCreateGroupPopup"
        />

        <add-contacts-in-group-popup
          :group-ids="staticGroupIds"
          :shown="isShowAddContactInGroupPopup"
          @close="isShowAddContactInGroupPopup = false"
          @load-data="loadDataList"
        />

        <div class="table-section__table-wrapper">
          <wt-empty
            v-show="showEmpty"
            :image="imageEmpty"
            :text="textEmpty"
            :primary-action-text="primaryActionTextEmpty"
            :disabled-primary-action="!hasCreateAccess"
            @click:primary="addGroup"
          />

          <wt-loader v-show="isLoading" />

          <wt-table
            v-show="dataList.length && !isLoading"
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
                  name: `${CrmSections.ContactGroups}-card`,
                  params: { id: item.id },
                }"
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
                :model-value="item.enabled"
                @update:model-value="
                  patchItemProperty({
                    index,
                    path: 'enabled',
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

<script lang="ts" setup>
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import { DynamicFilterSearchComponent as DynamicFilterSearch } from '@webitel/ui-datalist/filters';
import { WtEmpty } from '@webitel/ui-sdk/components';
import { useClose } from '@webitel/ui-sdk/composables';
import { CrmSections, IconAction } from '@webitel/ui-sdk/enums';
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import AddContactsInGroupPopup from '../modules/add-contacts-in-group/components/add-contacts-in-group-popup.vue';
import { useContactGroupsDatalistStore } from '../stores';
import CreateContactGroupPopup from './create-contact-group-popup.vue';

const { t } = useI18n();
const router = useRouter();

const { hasCreateAccess, hasUpdateAccess, hasDeleteAccess } =
	useUserAccessControl();

const tableStore = useContactGroupsDatalistStore();

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
	addFilter,
	updateFilter,
	deleteFilter,
	patchItemProperty,
} = tableStore;

initialize();

const {
	isVisible: isDeleteConfirmationPopup,
	deleteCount,
	deleteCallback,

	askDeleteConfirmation,
	closeDelete,
} = useDeleteConfirmationPopup();

const isCreateGroupPopup = ref(false);
const isShowAddContactInGroupPopup = ref(false);

const selectedStaticGroups = computed(() =>
	selected.value.filter((item) => item.type === ContactsGroupType.Static),
);

const staticGroupIds = computed(() =>
	selectedStaticGroups.value.map((item) => item.id),
);

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
		name: t('lookups.contactGroups.contactGroups', 2),
	},
]);

const { close } = useClose('configuration');

const {
	showEmpty,
	image: imageEmpty,
	text: textEmpty,
	primaryActionText: primaryActionTextEmpty,
} = useTableEmpty({
	dataList,
	filters: computed(() => filtersManager.value.getAllValues()),
	error,
	isLoading,
});

function edit(item: { id: string }) {
	return router.push({
		name: `${CrmSections.ContactGroups}-card`,
		params: {
			id: item.id,
		},
	});
}

function addGroup() {
	isCreateGroupPopup.value = true;
}

function closeCreateGroupPopup() {
	isCreateGroupPopup.value = false;
}
</script>

<style lang="scss" scoped></style>
