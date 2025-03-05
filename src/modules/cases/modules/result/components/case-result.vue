<template>
  <div class="case-result">
    <div class="opened-card-input-grid">
      <editable-field
        :edit-mode="editMode"
        :label="t('cases.closureReason')"
        :value="itemInstance?.close?.closeReason"
        @update:value="setItemProp({ path: 'close.closeReason', value: $event })"
      >
        <template #default="props">
          <wt-select
            v-bind="props"
            :key="closeReasonId"
            clearable
            :disabled="disableUserInput"
            :search-method="searchCloseReasons"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.result')"
        :value="itemInstance?.close?.closeResult"
        @update:value="setItemProp({ path: 'close.closeResult', value: $event })"
      >
        <template #default="props">
          <wt-input
            v-bind="props"
            :disabled="disableUserInput"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :label="t('cases.rating')"
        :value="itemInstance?.rate?.rating"
      />

      <editable-field
        :label="t('cases.ratingComment')"
        :value="itemInstance?.rate?.ratingComment"
      />
    </div>
  </div>
</template>
<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/store/new/modules/cardStoreModule/useCardStore.js';
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import EditableField from '../../case-info/components/editable-field.vue';
import CloseReasonsAPI from '../api/CloseReasonsAPI.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const editMode = inject('editMode');

const { t } = useI18n();
const store = useStore();

const { disableUserInput } = useUserAccessControl();

const {
  namespace: cardNamespace,
  itemInstance,
  setItemProp,
} = useCardStore(props.namespace);

const closeReasonId = computed(() => store.getters[`${cardNamespace}/service/CLOSE_REASON_ID`]);

async function searchCloseReasons(params) {
  if (!closeReasonId.value) {
    return { items: [] };
  }
  return await CloseReasonsAPI.getLookup({ closeReasonGroupId: closeReasonId.value, ...params });
}

</script>
<style lang="scss" scoped>
</style>
