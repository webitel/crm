<template>
  <section class="opened-contact-group-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <div class="opened-contact-group-general__wrapper">
        <wt-input
          :label="t('reusable.name')"
          :value="itemInstance.name"
          :v="v.itemInstance.name"
          required
          @input="setItemProp({ path: 'name', value: $event })"
        />

        <wt-textarea
          :label="t('vocabulary.description')"
          :value="itemInstance.description"
          @input="setItemProp({ path: 'description', value: $event })"
        />

        <wt-switcher
          :label="t('reusable.state')"
          :value="itemInstance.enabled"
          @change="setItemProp({ path: 'enabled', value: $event })"
        />
      </div>

      <wt-select
        v-if="itemInstance.type === WebitelContactsGroupType.DYNAMIC"
        :label="t('lookups.contactGroups.defaultGroup')"
        :search-method="loadStaticContactGroupsList"
        :value="itemInstance.defaultGroup"
        @input="setItemProp({ path: 'defaultGroup', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { WebitelContactsGroupType } from 'webitel-sdk';
import { useCardStore } from '@webitel/ui-sdk/store';
import ContactGroupsAPI from '../api/contactGroups.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  v: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

function loadStaticContactGroupsList(params) {
  return ContactGroupsAPI.getLookup({ ...params, type: WebitelContactsGroupType.STATIC });
}
</script>

<style lang="scss" scoped>
.opened-contact-group-general__wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
