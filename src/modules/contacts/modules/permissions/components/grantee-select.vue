<template>
  <wt-select
    v-bind="$attrs"
    :clearable="false"
    :label="t('objects.grantee', 1)"
    :search-method="loadRoles"
    :value="value"
    class="grantee-select"
    option-label="name"
    @input="emit('input', $event)"
  >
    <template #singleLabel="{ option, optionLabel }">
      <span class="grantee-select-option">
        <wt-icon
          :icon="option.user ? 'user' : 'role'"
          color="active"
        />
        {{ option[optionLabel] || option }}
      </span>
    </template>
    <template #option="{ option, optionLabel }">
      <span class="grantee-select-option">
        <wt-icon
          :icon="option.user ? 'user' : 'role'"
          color="active"
        />
        {{ option[optionLabel] || option }}
      </span>
    </template>
  </wt-select>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import RolesAPI from '../api/RolesAPI';

const props = defineProps({
  value: {
    required: true,
    type: Object,
  },
});

const emit = defineEmits(['input']);

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
