<template>
  <div class="case-info">
    <editable-field
      :edit-mode="editMode"
      :value="itemInstance.subject"
      :label="t('cases.subject')"
    >
      <template>
        <wt-input
          required
          :label="t('cases.subject')"
          :value="itemInstance.subject"
          @input="itemInstance.subject = $event"
        />
      </template>
    </editable-field>

    <editable-field
      :edit-mode="editMode"
      :value="itemInstance.description"
      :label="t('vocabulary.description')"
    >
      <template>
        <wt-textarea
          required
          :label="t('vocabulary.description')"
          :value="itemInstance.description"
          @input="itemInstance.description = $event"
        />
      </template>
    </editable-field>

    <div class="opened-card-input-grid">
      <editable-field
        :edit-mode="editMode"
        :value="itemInstance.source"
        :label="t('cases.source')"
      >
        <template>
          <!-- TODO: add valid options for source-->
          <wt-select
            required
            :label="t('cases.source')"
            :value="itemInstance.source"
            @input="itemInstance.source = $event"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :value="itemInstance.contactInfo"
        :label="t('cases.caseInfo.contactInfo')"
      >
        <template>
          <wt-input
            required
            :label="t('cases.caseInfo.contactInfo')"
            :value="itemInstance.contactInfo"
            @input="itemInstance.contactInfo = $event"
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
import { useStore } from 'vuex';
import EditableField from './editable-field.vue';

const { t } = useI18n();

const store = useStore();

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

const editMode = computed(() => store.getters[`${cardNamespace}/EDIT_MODE`]);

</script>

<style lang="scss" scoped>

</style>
