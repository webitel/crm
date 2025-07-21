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
        :disabled="disableUserInput"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-select
        :label="t('lookups.contactGroups.assignee')"
        :search-method="loadContact"
        :value="itemInstance.assignee"
        :disabled="
          disableUserInput || itemInstance.group?.type === WebitelContactsGroupType.Dynamic
        "
        @input="setItemProp({ path: 'assignee', value: $event })"
      />

      <wt-select
        :label="t('lookups.slas.slas')"
        :search-method="loadSlaList"
        :value="itemInstance.sla"
        :disabled="disableUserInput"
        :v="v.itemInstance.sla"
        @input="setItemProp({ path: 'sla', value: $event })"
      />

      <wt-select
        :label="t('lookups.contactGroups.contactGroups')"
        :search-method="loadContactGroupsList"
        :value="itemInstance.group"
        :disabled="disableUserInput"
        @input="setItemProp({ path: 'group', value: $event })"
      />

      <wt-input
        :label="t('lookups.serviceCatalogs.code')"
        :value="itemInstance.code"
        :disabled="disableUserInput"
        @input="setItemProp({ path: 'code', value: $event })"
      />

      <wt-switcher
        :label="t('reusable.state')"
        :disabled="disableUserInput"
        :value="itemInstance.state"
        @change="setItemProp({ path: 'state', value: $event })"
      />

      <wt-textarea
        :disabled="disableUserInput"
        :label="t('vocabulary.description')"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { ContactGroupsAPI, ContactsAPI, SlasAPI } from '@webitel/api-services/api';
import { WebitelContactsGroupType } from '@webitel/api-services/gen/models';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';

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
const { disableUserInput } = useUserAccessControl({
  useUpdateAccessAsAllMutableChecksSource: true,
});

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
  return ContactsAPI.getLookup(params);
};
</script>
