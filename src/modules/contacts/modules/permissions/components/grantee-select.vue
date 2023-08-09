<template>
  <wt-select
    class="grantee-select"
    option-label="name"
    :search-method="loadRoles"
    :label="t('objects.grantee', 1)"
    :clearable="false"
    v-bind="$attrs"
  >
    <template v-slot:singleLabel="{ option, optionLabel }">
      <span class="grantee-select-option">
        <wt-icon
          :icon="option.user ? 'user' : 'role'"
          color="active"
        ></wt-icon>
        {{ option[optionLabel] || option }}
      </span>
    </template>
    <template v-slot:option="{ option, optionLabel }">
      <span class="grantee-select-option">
        <wt-icon
          :icon="option.user ? 'user' : 'role'"
          color="active"
        ></wt-icon>
        {{ option[optionLabel] || option }}
      </span>
    </template>
  </wt-select>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import RolesAPI from '../api/RolesAPI';

const { t } = useI18n();

const loadRoles = (params) => RolesAPI.getList({ ...params, fields: ['id', 'name', 'user'] });
</script>

<style lang="scss" scoped>
//  elevating specificity
.wt-select.grantee-select .grantee-select-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
