<template>
  <section class="opened-sla-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <wt-input
        :label="t('reusable.name')"
        :value="itemInstance.name"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />

      <wt-select
        v-if="itemInstance.type === TypesContactGroups.DYNAMIC"
        :label="t('lookups.contactGroups.defaultGroup')"
        :search-method="loadStaticContactGroupsList"
        :value="itemInstance.defaultGroup"
        required
        @input="setItemProp({ prop: 'defaultGroup', value: $event })"
      />

      <wt-switcher
        :label="t('reusable.state')"
        :value="itemInstance.enabled"
        @change="setItemProp({ prop: 'enabled', value: $event })"
      />

    </div>
  </section>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TypesContactGroups from '../enums/TypeContactGroups.enum.js';
import ContactGroupsAPI from '../api/contactGroups.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

function loadStaticContactGroupsList(search) {
  return ContactGroupsAPI.getLookup({ type: TypesContactGroups.STATIC });
}
</script>

<style lang="scss" scoped>
.opened-sla-general__wrapper {
  display: flex;
  gap: var(--spacing-sm);
}
</style>
