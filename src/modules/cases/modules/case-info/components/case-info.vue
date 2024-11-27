<template>
  <div class="case-info">
    <editable-field
      :edit-mode="editMode"
      :label="t('cases.subject')"
      :value="itemInstance.subject"
      required
      @update:value="itemInstance.subject = $event"
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
      @update:value="itemInstance.description = $event"
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
        @update:value="itemInstance.source = $event"
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
        @update:value="itemInstance.contactInfo = $event"
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
});
const {
  namespace: cardNamespace,
  itemInstance,
} = useCardStore(props.namespace);

const editMode = computed(() => route.query.edit === 'true');

</script>

<style lang="scss" scoped>

</style>
