<template>
  <section class="opened-contact-group-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <div class="opened-contact-group-general__wrapper">
        <wt-input-text
          v-model:model-value="modelValue.name"
          :label="t('reusable.name')"
          :regle-validation="validationFields?.name"
          :disabled="disableUserInput"
          required
        />

        <wt-textarea
          v-model:model-value="modelValue.description"
          :label="t('vocabulary.description')"
          :disabled="disableUserInput"
        />

        <wt-switcher
          v-model:model-value="modelValue.enabled"
          :label="t('reusable.state')"
          :disabled="disableUserInput"
        />
      </div>

      <wt-single-select
        v-if="modelValue.type === ContactsGroupType.Dynamic"
        v-model:model-value="modelValue.defaultGroup"
        :label="t('lookups.contactGroups.defaultGroup')"
        :search-method="loadStaticContactGroupsList"
        :regle-validation="validationFields?.defaultGroup"
        :disabled="disableUserInput"
        required
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ContactGroupsAPI } from '@webitel/api-services/api';
import type { ContactsGroup } from '@webitel/api-services/gen/models';
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import type { CardValidationFields } from '@webitel/ui-datalist/card';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

const modelValue = defineModel<ContactsGroup>();

defineProps<{
	validationFields: CardValidationFields<ContactsGroup>;
}>();

const { t } = useI18n();
const { disableUserInput } = useUserAccessControl();

function loadStaticContactGroupsList(params: Record<string, unknown>) {
	return ContactGroupsAPI.getLookup({
		...params,
		type: ContactsGroupType.Static,
		enabled: true,
	});
}
</script>

<style lang="scss" scoped>
.opened-contact-group-general__wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}
</style>
