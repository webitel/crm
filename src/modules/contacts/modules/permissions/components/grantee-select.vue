<template>
  <wt-single-select
    v-bind="$attrs"
    :filterable="false"
    :label="t('objects.grantee', 1)"
    :search-method="loadRoles"
    :model-value="value"
    class="grantee-select"
    option-label="name"
    @update:model-value="emit('input', $event)"
  >
    <template #value="{ value, getOptionLabel }">
      <span class="grantee-select-option">
        <wt-icon
          :icon="value.user ? 'user' : 'role'"
          color="active"
        />
        {{ getOptionLabel(value) || value }}
      </span>
    </template>
    <template #option="{ option, getOptionLabel }">
      <span class="grantee-select-option">
        <wt-icon
          :icon="option.user ? 'user' : 'role'"
          color="active"
        />
        {{ getOptionLabel(option) || option }}
      </span>
    </template>
  </wt-single-select>
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

const emit = defineEmits([
	'input',
]);

const { t } = useI18n();

const loadRoles = (params) =>
	RolesAPI.getList({
		...params,
		fields: [
			'id',
			'name',
			'user',
		],
	});
</script>

<style scoped>
.grantee-select-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
