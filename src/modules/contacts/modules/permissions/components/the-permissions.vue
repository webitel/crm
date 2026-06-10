<template>
  <div class="permissions">
    <header class="permissions-header">
      <grantee-popup
        :namespace="namespace"
        @close="closeItemPopup"
      />
      <wt-icon-action
        :disabled="isActionDisabled"
        action="add"
        @click="addItem"
      />
      <wt-icon-action
        action="refresh"
        @click="loadData"
      />
    </header>

    <wt-loader v-show="isLoading" />

    <wt-empty
      v-show="showEmpty"
      :image="imageEmpty"
      :text="textEmpty"
      :primary-action-text="primaryActionTextEmpty"
      :disabled-primary-action="isActionDisabled"
      @click:primary="addItem"
    />

    <div
      v-show="dataList.length && !isLoading"
      class="table-wrapper"
    >
      <wt-table
        :headers="headers"
        :data="modifiedDataList"
        :selectable="false"
        sortable
        @sort="sort"
      >
        <template #grantee="{ item }">
          <div class="permissions-role-column">
            <wt-icon
              :icon="item.grantee.user ? 'user' : 'role'"
              color="active"
            />
            {{ item.grantee.name }}
          </div>
        </template>

        <template #read="{ item }">
          <wt-single-select
            v-if="access.hasRbacEditAccess"
            :model-value="item.access.r"
            :options="accessOptions"
            :show-clear="false"
            :disabled="isReadOnly"
            @update:model-value="changeReadAccessMode({ item, mode: $event })"
          />
          <span v-else>{{ item.access.r.name }}</span>
        </template>

        <template #edit="{ item }">
          <wt-single-select
            v-if="access.hasRbacEditAccess"
            :model-value="item.access.w"
            :options="accessOptions"
            :show-clear="false"
            :disabled="isReadOnly"
            @update:model-value="changeUpdateAccessMode({ item, mode: $event })"
          />
          <span v-else>{{ item.access.w.name }}</span>
        </template>

        <template #delete="{ item }">
          <wt-single-select
            v-if="access.hasRbacEditAccess"
            :model-value="item.access.d"
            :options="accessOptions"
            :show-clear="false"
            :disabled="isReadOnly"
            @update:model-value="changeDeleteAccessMode({ item, mode: $event })"
          />
          <span v-else>{{ item.access.d.name }}</span>
        </template>
        <template #actions="{ item }">
          <wt-icon-action
            :disabled="isActionDisabled"
            action="delete"
            @click="
              changeReadAccessMode({ item, mode: { id: AccessMode.FORBIDDEN } })
            "
          />
        </template>
      </wt-table>
      <filter-pagination
        :namespace="filtersNamespace"
        :is-next="isNext"
      />
    </div>
  </div>
</template>

<script setup>
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { computed, inject, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import AccessMode from '../enums/AccessMode.enum';
import GranteePopup from './permissions-tab-grantee-popup.vue';

const access = inject('access');
const isReadOnly = inject('isReadOnly');

const isActionDisabled = computed(
	() => !access.value.hasRbacEditAccess || isReadOnly,
);

const props = defineProps({
	namespace: {
		type: String,
		required: true,
	},
});

const { t } = useI18n();
const store = useStore();
const router = useRouter();
const route = useRoute();

const {
	namespace,

	dataList,
	isLoading,
	headers,
	error,
	isNext,

	loadData,
	patchProperty,
	deleteData,
	sort,
	onFilterEvent,
} = useTableStore(`${props.namespace}/permissions`);

const {
	namespace: filtersNamespace,
	filtersValue,
	subscribe,
	flushSubscribers,
	restoreFilters,
} = useTableFilters(namespace);

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

subscribe({
	event: '*',
	callback: onFilterEvent,
});

restoreFilters();

onUnmounted(() => {
	flushSubscribers();
});

const modifiedDataList = computed(() => {
	return dataList.value.map((item) => {
		const access = {};
		Object.keys(item.access).forEach((rule) => {
			access[rule] = {
				...item.access[rule],
				name: t(`permissions.accessMode.${item.access[rule].id}`),
			};
		});
		return {
			...item,
			access,
		};
	});
});

const accessOptions = computed(() => {
	return Object.values(AccessMode).map((mode) => ({
		id: mode,
		name: t(`permissions.accessMode.${mode}`),
	}));
});

function changeReadAccessMode(payload) {
	return store.dispatch(`${namespace}/CHANGE_READ_ACCESS_MODE`, payload);
}
function changeUpdateAccessMode(payload) {
	return store.dispatch(`${namespace}/CHANGE_UPDATE_ACCESS_MODE`, payload);
}
function changeDeleteAccessMode(payload) {
	return store.dispatch(`${namespace}/CHANGE_DELETE_ACCESS_MODE`, payload);
}

function addItem() {
	return router.push({
		...route,
		params: {
			permissionId: 'new',
		},
	});
}

function closeItemPopup() {
	const params = {
		...route.params,
	};
	delete params.permissionId;

	return router.push({
		...route,
		params,
	});
}
</script>

<style lang="scss" scoped>
.permissions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.permissions-header {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
  align-items: center;
}

.permissions-role-column {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
