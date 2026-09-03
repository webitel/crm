<template>
  <div class="case-info">
    <editable-field
      :model-value="modelValue.subject"
      :edit-mode="isEditable"
      :label="t('cases.subject')"
      required
      @update:model-value="modelValue.subject = $event"
    >
      <template #default="props">
        <wt-input-text
          :label="props.label"
          :required="props.required"
          :model-value="props.modelValue"
          :regle-validation="validationFields.subject"
          :disabled="disableUserInput"
          @update:model-value="props.updateValue($event)"
        />
      </template>
    </editable-field>

    <editable-field
      :model-value="modelValue.description"
      :edit-mode="isEditable"
      :label="t('vocabulary.description')"
      @update:model-value="modelValue.description = $event"
    >
      <template #default="props">
        <wt-textarea
          :rows="8"
          :label="props.label"
          :required="props.required"
          :disabled="disableUserInput"
          :model-value="props.modelValue"
          @update:model-value="props.updateValue($event)"
        />
      </template>
    </editable-field>

    <div class="opened-card-input-grid">
      <editable-field
        :model-value="modelValue.source"
        color="info"
        :icon="modelValue.source?.type"
        :edit-mode="isEditable"
        :label="t('cases.source')"
        required
        @update:model-value="modelValue.source = $event"
      >
        <template #default="props">
          <wt-single-select
            :label="props.label"
            :required="props.required"
            :model-value="props.modelValue"
            :regle-validation="validationFields.source"
            :disabled="disableUserInput || !hasSourcesReadAccess"
            :search-method="hasSourcesReadAccess && CaseSourcesAPI.getLookup"
            @update:model-value="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :model-value="modelValue.contactInfo"
        :edit-mode="isEditable"
        :label="t('cases.caseInfo.contactInfo')"
        @update:model-value="modelValue.contactInfo = $event"
      >
        <template #default="props">
          <wt-input-text
            :label="props.label"
            :required="props.required"
            :model-value="props.modelValue"
            :disabled="disableUserInput"
            @update:model-value="props.updateValue($event)"
          />
        </template>
      </editable-field>
    </div>

    <related-cases
      v-if="itemId"
      :parent-id="(itemId as unknown as string)"
    />

    <case-comments
      v-if="hasCaseCommentsReadAccess && itemId"
      :parent-id="(itemId as unknown as string)"
    />
  </div>
</template>
<script setup lang="ts">
import { CaseSourcesAPI } from '@webitel/api-services/api';
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { WtObject } from '@webitel/ui-sdk/enums';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import { useCaseAccessState } from '../../../composables/useCaseAccessState';
import { useCasesCardStore } from '../../../stores/card/casesCardStore';
import CaseComments from '../../comments/components/case-comments.vue';
import RelatedCases from '../../related-cases/components/related-cases.vue';
import EditableField from './editable-field.vue';

const { isEditable } = useCaseAccessState();

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();
const { hasReadAccess: hasCaseCommentsReadAccess } = useUserAccessControl({
	resource: WtObject.CaseComment,
});
const { hasReadAccess: hasSourcesReadAccess } = useUserAccessControl(
	WtObject.Source,
);

const casesCardStore = useCasesCardStore();
const { itemId } = storeToRefs(casesCardStore);
const { modelValue, validationFields } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});
</script>

<style lang="scss" scoped></style>
