<template>
  <div class="permissions-role-column">
    <wt-icon
      :icon="role.user ? 'user' : 'role'"
      class="permissions-role-icon"
    />
    {{ role.name }}
  </div>
</template>

<script>
export default {
  name: 'PermissionsRoleColumn',
  props: {
    role: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.permissions-role-column {
  display: grid;
  align-items: center;
  grid-template-columns: var(--icon-md-size) 1fr;
  gap: var(--spacing-sm);
}
</style>
