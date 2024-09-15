<template>
  <wt-select
    class="permissions-role-select"
    option-label="name"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #singleLabel="{ option, optionLabel }">
      <span class="multiselect__single-label permissions-tab-role-popup__select-option">
        <wt-icon
          :icon="option.user ? 'user' : 'role'"
          class="permissions-role-icon"
        />
        {{ option[optionLabel] || option }}
      </span>
    </template>

    <template #option="{ option, optionLabel }">
      <span class="permissions-tab-role-popup__select-option">
        <wt-icon
          :icon="option.user ? 'user' : 'role'"
          class="permissions-role-icon"
        />
        {{ option[optionLabel] || option }}
      </span>
    </template>
  </wt-select>
</template>

<script>
export default {
  name: 'PermissionsRoleSelect',
};
</script>

<style lang="scss" scoped>
//  elevating specificity
.wt-select.permissions-role-select .permissions-tab-role-popup__select-option {
  display: flex;
  align-items: center;
}

.permissions-role-icon {
  margin-right: var(--spacing-sm);
}
</style>
