<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <wt-input
        :label="t('reusable.name')"
        :value="itemInstance.name"
        :v="v.itemInstance.name"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-select
        :label="t('lookups.contactGroups.assignee')"
        :search-method="loadContact"
        :value="itemInstance.assignee"
        :disabled="
          itemInstance.group?.type === WebitelContactsGroupType.DYNAMIC
        "
        @input="setItemProp({ path: 'assignee', value: $event })"
      />

      <wt-select
        :label="t('lookups.slas.slas')"
        :search-method="loadSlaList"
        :value="itemInstance.sla"
        :v="v.itemInstance.sla"
        @input="setItemProp({ path: 'sla', value: $event })"
      />

      <wt-select
        :label="t('lookups.contactGroups.contactGroups')"
        :search-method="loadContactGroupsList"
        :value="itemInstance.group"
        @input="setItemProp({ path: 'group', value: $event })"
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
import { contacts } from '@webitel/ui-sdk/src/api/clients/сontacts/index.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';
import { WebitelContactsGroupType } from 'webitel-sdk';

import ContactGroupsAPI from '../../../../contact-groups/api/contactGroups.js';
import SlasAPI from '../../../../slas/api/slas.js';

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

const loadSlaList = (params) => {
  return SlasAPI.getLookup(params);
};

const loadContactGroupsList = (params) => {
  return ContactGroupsAPI.getLookup({
    ...params,
    fields: ['id', 'name', 'type'],
  });
};

const loadContact = (params) => {
  return contacts.getLookup(params);
};
</script>
