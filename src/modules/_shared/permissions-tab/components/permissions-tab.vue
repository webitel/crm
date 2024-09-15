<template>
  <section>
    <role-popup
      :shown="isRoleSelectPopup"
      :namespace="namespace"
      :sub-namespace="subNamespace"
      @close="closeRoleSelectPopup"
    />

    <header class="content-header">
      <h3 class="content-title">
        {{ $t('objects.permissions.object.operations') }}
      </h3>
      <div class="content-header__actions-wrap">
        <wt-table-actions
          :icons="['refresh']"
          @input="tableActionsHandler"
        >
          <wt-icon-btn
            v-if="!disableUserInput"
            class="icon-action"
            icon="plus"
            @click="addItem"
          />
        </wt-table-actions>
      </div>
    </header>

    <wt-loader v-show="!isLoaded" />
    <div
      v-show="isLoaded"
      class="table-wrapper"
    >
      <div class="table-wrapper__visible-scroll-wrapper">
        <wt-table
          :data="dataList"
          :grid-actions="!disableUserInput"
          :headers="headers"
          :selectable="false"
          sortable
          @sort="sort"
        >
          <template #grantee="{ item }">
            <role-column :role="item.grantee" />
          </template>

          <template #read="{ item }">
            <wt-select
              :clearable="false"
              :disabled="disableUserInput"
              :options="accessOptions"
              :value="item.access.r"
              @input="changeReadAccessMode({ item, mode: $event })"
            />
          </template>

          <template #edit="{ item }">
            <wt-select
              :clearable="false"
              :disabled="disableUserInput"
              :options="accessOptions"
              :value="item.access.w"
              @input="changeUpdateAccessMode({ item, mode: $event })"
            />
          </template>

          <template #delete="{ item }">
            <wt-select
              :clearable="false"
              :disabled="disableUserInput"
              :options="accessOptions"
              :value="item.access.d"
              @input="changeDeleteAccessMode({ item, mode: $event })"
            />
          </template>
          <template #actions="{ item }">
            <wt-icon-action
              action="delete"
              @click="changeReadAccessMode({ item, mode: { id: accessMode.FORBIDDEN }})"
            />
          </template>
        </wt-table>
      </div>
      <wt-pagination
        :next="isNext"
        :prev="page > 1"
        :size="size"
        debounce
        @change="loadList"
        @input="setSize"
        @next="nextPage"
        @prev="prevPage"
      />
    </div>
  </section>
</template>

<script>
import openedTabComponentMixin from '../../../../app/mixins/objectPagesMixins/openedObjectTabMixin/openedTabComponentMixin';
import permissionsTabMixin from '../../../../app/mixins/objectPagesMixins/permissionsTabMixin/permissionsTabMixin';
import RoleColumn from './_internals/permissions-role-column.vue';
import RolePopup from './permissions-tab-role-popup.vue';

export default {
  name: 'PermissionsTab',
  components: { RolePopup, RoleColumn },
  mixins: [openedTabComponentMixin, permissionsTabMixin],
  data: () => ({
    subNamespace: 'permissions',
  }),
};
</script>

<style lang="scss" scoped>
</style>
