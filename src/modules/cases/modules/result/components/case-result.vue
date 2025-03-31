<template>
  <div class="case-result">
    <div class="opened-card-input-grid">
      <editable-field
        :edit-mode="editMode"
        :label="t('cases.closureReason')"
        :value="itemInstance.closeReason"
        @update:value="setItemProp({ path: 'closeReason', value: $event })"
      >
        <template #default="props">
          <wt-select
            v-bind="props"
            :key="closeReasonId"
            :disabled="disableUserInput || !itemInstance.statusCondition.final"
            :v="v$.value.itemInstance.closeReason"
            :search-method="searchCloseReasons"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.result')"
        :value="itemInstance.closeResult"
        @update:value="setItemProp({ path: 'closeResult', value: $event })"
      >
        <template #default="props">
          <wt-input
            v-bind="props"
            :v="v$.value.itemInstance.closeResult"
            :disabled="disableUserInput || !itemInstance.statusCondition.final"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :label="t('cases.rating')"
        :value="itemInstance.rating"
      />

      <editable-field
        :label="t('cases.ratingComment')"
        :value="itemInstance.ratingComment"
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
const v$ = inject('v$');

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
