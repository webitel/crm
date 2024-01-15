<template>
  <div class="permissions">
    <header class="permissions-header">
      <grantee-popup
        v-if="isGranteePopup"
        :callback="grantPermissions"
        :namespace="namespace"
        @close="isGranteePopup = false"
      />
      <wt-icon-action
        :disabled="!access.hasRbacEditAccess"
        action="add"
        @click="isGranteePopup = true"
      />
      <wt-icon-action
        action="refresh"
        @click="loadData"
      />
    </header>

    <wt-loader v-show="isLoading" />

    <div
      v-show="!isLoading"
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
          <wt-select
            v-if="access.hasRbacEditAccess"
            :value="item.access.r"
            :options="accessOptions"
            :clearable="false"
            @input="changeReadAccessMode({ item, mode: $event })"
          />
          <span v-else>{{ item.access.r.name }}</span>
        </template>

        <template #edit="{ item }">
          <wt-select
            v-if="access.hasRbacEditAccess"
            :value="item.access.w"
            :options="accessOptions"
            :clearable="false"
            @input="changeUpdateAccessMode({ item, mode: $event })"
          />
          <span v-else>{{ item.access.w.name }}</span>
        </template>

        <template #delete="{ item }">
          <wt-select
            v-if="access.hasRbacEditAccess"
            :value="item.access.d"
            :options="accessOptions"
            :clearable="false"
            @input="changeDeleteAccessMode({ item, mode: $event })"
          />
          <span v-else>{{ item.access.d.name }}</span>
        </template>
        <template #actions="{ item }">
          <wt-icon-action
            :disabled="!access.hasRbacEditAccess"
            action="delete"
            @click="changeReadAccessMode({ item, mode: { id: AccessMode.FORBIDDEN }})"
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
