<template>
  <div class="permissions">
    <header class="permissions-header">
      <grantee-popup
        v-if="isGranteePopup"
        :callback="grantPermissions"
        @close="isGranteePopup = false"
      ></grantee-popup>
      <wt-icon-action
        v-if="access.hasRbacEditAccess"
        action="add"
        @click="isGranteePopup = true"
      ></wt-icon-action>
      <wt-icon-action
        action="refresh"
        @click="loadData"
      ></wt-icon-action>
    </header>

    <wt-loader v-show="isLoading"></wt-loader>

    <div v-show="!isLoading" class="table-wrapper">
      <wt-table
        :headers="headers"
        :data="modifiedDataList"
        :grid-actions="access.hasRbacEditAccess"
        :selectable="false"
        sortable
        @sort="sort"
      >

        <template v-slot:grantee="{ item }">
          <div class="permissions-role-column">
            <wt-icon
              :icon="item.grantee.user ? 'user' : 'role'"
              color="active"
            ></wt-icon>
            {{ item.grantee.name }}
          </div>
        </template>

        <template v-slot:read="{ item }">
          <wt-select
            v-if="access.hasRbacEditAccess"
            :value="item.access.r"
            :options="accessOptions"
            :clearable="false"
            @input="changeReadAccessMode({ item, mode: $event })"
          ></wt-select>
          <span v-else>{{ item.access.r.name }}</span>
        </template>

        <template v-slot:edit="{ item }">
          <wt-select
            v-if="access.hasRbacEditAccess"
            :value="item.access.w"
            :options="accessOptions"
            :clearable="false"
            @input="changeUpdateAccessMode({ item, mode: $event })"
          ></wt-select>
          <span v-else>{{ item.access.w.name }}</span>
        </template>

        <template v-slot:delete="{ item }">
          <wt-select
            v-if="access.hasRbacEditAccess"
            :value="item.access.d"
            :options="accessOptions"
            :clearable="false"
            @input="changeDeleteAccessMode({ item, mode: $event })"
          ></wt-select>
          <span v-else>{{ item.access.d.name }}</span>
        </template>
        <template v-slot:actions="{ item }">
          <wt-icon-action
            action="delete"
            @click="changeReadAccessMode({ item, mode: { id: AccessMode.FORBIDDEN }})"
          ></wt-icon-action>
        </template>
      </wt-table>
      <filter-pagination
        :namespace="filtersNamespace"
        :is-next="isNext"
      ></filter-pagination>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useTableFilters } from '@webitel/ui-sdk/src/modules/Filters/composables/useTableFilters';
import { useTableStore } from '@webitel/ui-sdk/src/modules/TableStoreModule/composables/useTableStore';
import { useI18n } from 'vue-i18n';
import FilterPagination from '@webitel/ui-sdk/src/modules/Filters/components/filter-pagination.vue';
import { useStore } from 'vuex';
import GranteePopup from './permissions-tab-grantee-popup.vue';
import AccessMode from '../enums/AccessMode.enum';

const access = inject('access');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();
const store = useStore();

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
} = useTableStore(`${props.namespace}/permissions`);

const { filtersNamespace } = useTableFilters(namespace);

const isGranteePopup = ref(false);

const modifiedDataList = computed(() => {
  return dataList.value.map((item) => {
    const access = {};
    Object.keys(item.access).forEach((rule) => {
      access[rule] = {
        ...item.access[rule],
        name: t(`permissions.accessMode.${item.access[rule].id}`),
      };
    });
    return { ...item, access };
  });
});

const accessOptions = computed(() => {
  return Object.values(AccessMode).map((mode) => ({
    id: mode,
    name: t(`permissions.accessMode.${mode}`),
  }));
});

function grantPermissions(payload) {
  return store.dispatch(`${namespace}/GRANT_PERMISSIONS`, payload);
}

function changeReadAccessMode(payload) {
  return store.dispatch(`${namespace}/CHANGE_READ_ACCESS_MODE`, payload);
}
function changeUpdateAccessMode(payload) {
  return store.dispatch(`${namespace}/CHANGE_UPDATE_ACCESS_MODE`, payload);
}
function changeDeleteAccessMode(payload) {
  return store.dispatch(`${namespace}/CHANGE_DELETE_ACCESS_MODE`, payload);
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
