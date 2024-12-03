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
        :edit-mode="editMode"
        :label="t('cases.source')"
        :value="itemInstance.source"
        required
        @update:value="setItemProp({ path: 'source', value: $event })"
      >
        <template #default="props">
          <wt-select
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.caseInfo.contactInfo')"
        :value="itemInstance.contactInfo"
        required
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
  </div>
</template>
<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import EditableField from './editable-field.vue';

const { t } = useI18n();

const store = useStore();
const route = useRoute();

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
});
const {
  namespace: cardNamespace,
  itemInstance,
  setItemProp,
} = useCardStore(props.namespace);

</script>

<style lang="scss" scoped>

</style>
