<template>
  <wt-popup
    class="permissions-tab-role-popup"
    size="sm"
    v-bind="$attrs"
    overflow
    @close="close"
  >
    <template #title>
      {{ $t('objects.permissions.object.newPermissionRole') }}
    </template>
    <template #main>
      <permissions-role-select
        v-model="newGrantee"
        :clearable="false"
        :placeholder="$tc('objects.permissions.permissionsRole', 1)"
        :search-method="getAvailableGrantees"
      />
    </template>
    <template #actions>
      <wt-button @click="save">
        {{ $t('objects.add') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ $t('objects.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script>
import permissionsTabRolePopupMixins from '../../../../app/mixins/objectPagesMixins/permissionsTabMixin/permissionsTabRolePopupMixin';
import PermissionsRoleSelect from './_internals/permissions-role-select.vue';

export default {
  name: 'PermissionsTabRolePopup',
  components: { PermissionsRoleSelect },
  mixins: [permissionsTabRolePopupMixins],
};
</script>

<style lang="scss" scoped>
</style>
