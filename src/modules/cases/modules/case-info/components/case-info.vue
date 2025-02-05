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
          v-bind="props"
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
        :value="itemInstance.source?.name"
        required
        @update:value="setItemProp({ path: 'source', value: $event })"
      >
        <template #default="props">
          <wt-select
            v-bind="props"
            :search-method="SourcesAPI.getLookup"
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
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>
    </div>
    <case-comments
      :item-id="id"
      :namespace="commentsNamespace"
    />
  </div>
</template>
<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { snakeToKebab } from '@webitel/ui-sdk/src/scripts/index.js';
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import SourcesAPI from '../../../../configuration/modules/lookups/modules/sources/api/sources.js';
import EditableField from './editable-field.vue';
import CaseComments from '../modules/comments/components/case-comments.vue';

const { t } = useI18n();

const store = useStore();
const route = useRoute();

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});
const {
  namespace: cardNamespace,
  itemInstance,
  setItemProp,
  id,
} = useCardStore(props.namespace);

const commentsNamespace = `${props.namespace}/comments`;

const editMode = inject('editMode');
</script>

<style lang="scss" scoped>

</style>
