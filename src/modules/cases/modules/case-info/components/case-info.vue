<template>
  <div class="case-info">
    <editable-field
      :edit-mode="editMode"
      :value="itemInstance.subject"
      :label="t('cases.subject')"
      @update:value="itemInstance.subject = $event"
    >
      <template #default="{ value, label, updateValue }">
        <wt-input
          required
          :label="label"
          :value="value"
          @input="updateValue($event)"
        />
      </template>
    </editable-field>

    <editable-field
      :edit-mode="editMode"
      :value="itemInstance.description"
      :label="t('vocabulary.description')"
      @update:value="itemInstance.description = $event"
    >
      <template #default="{ value, label, updateValue }">
        <wt-textarea
          required
          :label="label"
          :value="value"
          @input="updateValue($event)"
        />
      </template>
    </editable-field>

    <div class="opened-card-input-grid">
      <editable-field
        :edit-mode="editMode"
        :value="itemInstance.source"
        :label="t('cases.source')"
        @update:value="itemInstance.source = $event"
      >
        <template #default="{ value, label, updateValue }">
          <wt-select
            required
            :label="label"
            :value="value"
            @input="updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :value="itemInstance.contactInfo"
        :label="t('cases.caseInfo.contactInfo')"
        @update:value="itemInstance.contactInfo = $event"
      >
        <template #default="{ value, label, updateValue }">
          <wt-input
            :label="label"
            :value="value"
            required
            @input="updateValue($event)"
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
});
const {
  namespace: cardNamespace,
  itemInstance,
} = useCardStore(props.namespace);

const editMode = computed(() => route.query.edit === 'true');

</script>

<style lang="scss" scoped>

</style>
