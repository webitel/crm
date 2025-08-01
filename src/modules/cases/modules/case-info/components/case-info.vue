<template>
  <div class="case-info">
    <editable-field
      :edit-mode="editMode"
      :label="t('cases.subject')"
      :value="itemInstance.subject"
      required
      @update:value="setItemProp({ path: 'subject', value: $event })"
    >
      <template #default="props">
        <wt-input
          v-bind="props"
          :v="v$.value.itemInstance.subject"
          :disabled="disableUserInput"
          @input="props.updateValue($event)"
        />
      </template>
    </editable-field>

    <editable-field
      :edit-mode="editMode"
      :label="t('vocabulary.description')"
      :value="itemInstance.description"
      required
      @update:value="setItemProp({ path: 'description', value: $event })"
    >
      <template #default="props">
        <wt-textarea
          :rows="8"
          v-bind="props"
          :disabled="disableUserInput"
          @input="props.updateValue($event)"
        />
      </template>
    </editable-field>

    <div class="opened-card-input-grid">
      <editable-field
        color="info"
        :icon="itemInstance.source?.type"
        :edit-mode="editMode"
        :label="t('cases.source')"
        :value="itemInstance.source"
        required
        @update:value="setItemProp({ path: 'source', value: $event })"
      >
        <template #default="props">
          <wt-select
            v-bind="props"
            :v="v$.value.itemInstance.source"
            :disabled="disableUserInput"
            :search-method="CaseSourcesAPI.getLookup"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.caseInfo.contactInfo')"
        :value="itemInstance.contactInfo"
        @update:value="setItemProp({ path: 'contactInfo', value: $event })"
      >
        <template #default="props">
          <wt-input
            v-bind="props"
            :disabled="disableUserInput"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>
    </div>

    <related-cases
      v-if="id"
      :parent-id="id"
    />

    <case-comments
      v-if="hasCaseCommentsReadAccess && id"
      :parent-id="id"
    />
  </div>
</template>
<script setup>
import { CaseSourcesAPI } from '@webitel/api-services/api';
import { WtObject } from '@webitel/ui-sdk/enums';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore.js';
import { inject, provide } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import CaseComments from '../../comments/components/case-comments.vue';
import RelatedCases from '../../related-cases/components/related-cases.vue';
import EditableField from './editable-field.vue';

const editMode = inject('editMode');
const v$ = inject('v$');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();
const {
  hasReadAccess: hasCaseCommentsReadAccess,
} = useUserAccessControl({ resource: WtObject.CaseComment });

const {
  itemInstance,
  setItemProp,
  id,
} = useCardStore(props.namespace);

const { isNew } = useCardComponent({
  id,
  itemInstance,
});
</script>

<style lang="scss" scoped></style>
