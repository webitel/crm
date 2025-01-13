<template>
  <section class="opened-service-catalog-general">
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

      <wt-select
        :label="t('lookups.serviceCatalogs.assignee')"
        :search-method="loadSlaList"
        :value="itemInstance.assignee"
        :clearable="false"
        @input="setItemProp({ path: 'sla', value: $event })"
      />

      <wt-select
        :label="t('lookups.slas.slas')"
        :search-method="loadSlaList"
        :value="itemInstance.sla"
        required
        :clearable="false"
        @input="setItemProp({ path: 'sla', value: $event })"
      />

      <wt-select
        :label="t('lookups.serviceCatalogs.group')"
        :search-method="loadSlaList"
        :value="itemInstance.groups"
        :clearable="false"
        @input="setItemProp({ path: 'sla', value: $event })"
      />

      <wt-input
        :label="t('lookups.serviceCatalogs.code')"
        :value="itemInstance.code"
        @input="setItemProp({ path: 'code', value: $event })"
      />

      <wt-switcher
        :label="t('reusable.state')"
        :value="itemInstance.state"
        @change="setItemProp({ path: 'state', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';

import SlasAPI from '../../../../slas/api/slas.js';
const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  isNew: {
    type: Boolean,
    required: true,
  }
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

function loadSlaList(search) {
  return SlasAPI.getLookup(search);
}

</script>

<style lang="scss" scoped>
.opened-sla-general__wrapper {
  display: flex;
  gap: var(--spacing-sm);
}
</style>
