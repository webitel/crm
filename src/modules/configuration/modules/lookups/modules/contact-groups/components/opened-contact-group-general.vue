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
          :disabled="disableUserInput"
          required
          @input="setItemProp({ path: 'name', value: $event })"
        />

        <wt-textarea
          :label="t('vocabulary.description')"
          :model-value="itemInstance.description"
          :disabled="disableUserInput"
          @update:model-value="setItemProp({ path: 'description', value: $event })"
        />

        <wt-switcher
          :label="t('reusable.state')"
          :value="itemInstance.enabled"
          :disabled="disableUserInput"
          @change="setItemProp({ path: 'enabled', value: $event })"
        />
      </div>

      <wt-select
        v-if="itemInstance.type === WebitelContactsGroupType.Dynamic"
        :label="t('lookups.contactGroups.defaultGroup')"
        :search-method="loadStaticContactGroupsList"
        :value="itemInstance.defaultGroup"
        :v="v.itemInstance.defaultGroup"
        :disabled="disableUserInput"
        required
        @input="setItemProp({ path: 'defaultGroup', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { ContactGroupsAPI } from '@webitel/api-services/api';
import { WebitelContactsGroupType } from '@webitel/api-services/gen/models';
import { useCardStore } from '@webitel/ui-sdk/store';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

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
const route = useRoute();

const { disableUserInput } = useUserAccessControl();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

function loadStaticContactGroupsList(params) {
  return ContactGroupsAPI.getLookup({
    ...params,
    type: WebitelContactsGroupType.Static,
    enabled: true,
  });
}

function setContactGroupType() {
  if(route.query.type) {
    setItemProp({ path: 'type', value: route.query.type.toUpperCase() });
  }
}

onMounted(() => setContactGroupType());
</script>

<style lang="scss" scoped>
.opened-contact-group-general__wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
