<template>
  <div class="case-result">
    <div class="opened-card-input-grid">
      <editable-field
        :edit-mode="editMode"
        :label="t('cases.reason')"
        :value="itemInstance?.close?.closeReason?.name"
        required
        @update:value="setItemProp({ path: 'close.closeReason', value: $event })"
      >
        <template #default="props">
          <wt-select
            v-bind="props"
            :search-method="searchCloseReasons"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.result')"
        :value="itemInstance?.close?.closeResult"
        required
        @update:value="setItemProp({ path: 'close.closeResult', value: $event })"
      >
        <template #default="props">
          <wt-input
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :label="t('cases.rating')"
        :value="itemInstance?.rate?.rating"
      >
      </editable-field>

      <editable-field
        :label="t('cases.ratingComment')"
        :value="itemInstance?.rate?.ratingComment"
      >
      </editable-field>
    </div>
  </div>
</template>
<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import EditableField from '../../case-info/components/editable-field.vue';
import CloseReasonsAPI from '../api/CloseReasonsAPI.js';

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
} = useCardStore(props.namespace);

const closeReasonId = computed(() => store.getters[`${props.namespace}/service/CLOSE_REASON_ID`]);

async function searchCloseReasons() {
  return await CloseReasonsAPI.getLookup({ closeReasonGroupId: closeReasonId.value });
}

const editMode = inject('editMode');
</script>
<style lang="scss" scoped>
</style>
