<template>
  <wt-select
    v-bind="$attrs"
    :clearable="false"
    :label="t('objects.grantee', 1)"
    :search-method="getAvailableGrantees"
    :value="value"
    class="grantee-select"
    option-label="name"
    @input="emit('input', $event)"
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
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import RolesAPI from '../api/RolesAPI';

const props = defineProps({
  value: {
    required: true,
    type: Object,
  },
  namespace: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['input']);

const { t } = useI18n();

const store = useStore();
const dataList = computed(() => getNamespacedState(store.state, props.namespace).dataList);

async function getAvailableGrantees(params) {
  const roles = await RolesAPI.getList({
    ...params,
    fields: ['id', 'name', 'user'],
  });
  const usedRoles = dataList.value;
  roles.items = roles.items.filter((role) => !usedRoles.some((usedRole) => usedRole.grantee.id === role.id));
  return roles;
}
</script>

<style lang="scss" scoped>
//  elevating specificity
.wt-select.grantee-select .grantee-select-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}
</style>
