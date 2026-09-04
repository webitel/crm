<template>
  <div class="case-priority">
    <div>
      <editable-field
        :model-value="modelValue.priority"
        :edit-mode="isEditable"
        :label="t('cases.priority')"
        required
        @update:model-value="modelValue.priority = $event"
      >
        <template #default="props">
          <wt-single-select
            :label="props.label"
            :required="props.required"
            :model-value="props.modelValue"
            :disabled="disableUserInput || !hasPrioritiesReadAccess"
            :regle-validation="validationFields.priority"
            :placeholder="t('cases.priority')"
            :search-method="hasPrioritiesReadAccess && CasePrioritiesAPI.getLookup"
            class="case-priority__select"
            @update:model-value="props.updateValue($event)"
          />
        </template>
      </editable-field>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CasePrioritiesAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { WtObject } from '@webitel/ui-sdk/enums';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import { useCaseAccessState } from '../../../composables/useCaseAccessState';
import { useCasesCardStore } from '../../../stores/card/casesCardStore';
import EditableField from '../../case-info/components/editable-field.vue';

const { t } = useI18n();

const { isEditable } = useCaseAccessState();

const { disableUserInput } = useUserAccessControl();
const { hasReadAccess: hasPrioritiesReadAccess } = useUserAccessControl(
	WtObject.Priorities,
);

const { modelValue, validationFields } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-priority {
  width: 100%;

  &__select {
    padding: var(--spacing-xs);
  }
}
</style>
