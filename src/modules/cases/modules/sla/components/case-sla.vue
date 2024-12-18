<template>
  <div class="case-sla">
    <span class="case-sla__title">{{ t('cases.appliedSLA') }}</span>
    <div
      v-if="itemInstance.sla"
      class="case-sla__content"
    >
      <div class="case-sla__sla-name">
        <span>{{ itemInstance?.sla?.name }}</span>
      </div>
      <div
        v-for="condition in itemInstance?.slaCondition"
        :key="condition.id"
        class="case-sla__sla-condition"
      >
        <wt-icon
          color="error"
          icon="stop-sign"
        />
        <span class="case-sla__sla-condition-name">
          {{ condition.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import slaConditionsAPI from '../api/SLAConditionsAPI.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
  setItemProp,
  deleteItem,
} = useCardStore(props.namespace);

const {
  isNew,
  pathName,
  disabledSave,
  saveText,
  save,
  initialize,
  initializeCard,
} = useCardComponent({
  id,
  itemInstance,
  loadItem,
  addItem,
  updateItem,
  setId,
  resetState,
});

const { t } = useI18n();
const store = useStore();

const serviceSLA = computed(() => store.getters[`${props.namespace}/service/SLA`]);

watch(
  () => serviceSLA.value?.id,
  async (newSlaId) => {
    if (newSlaId) {
      const slaConditionResponse = await slaConditionsAPI.getList({ slaId: newSlaId });
      await setItemProp({
        path: 'sla',
        value: serviceSLA.value,
      });
      await setItemProp({
        path: 'slaCondition',
        value: slaConditionResponse.items,
      });
    }
  }
);
</script>

<style lang="scss" scoped>
.case-sla {
  width: 100%;

  &__title {
    display: block;
    @extend %typo-heading-4;
  }

  &__title {
    padding: var(--spacing-xs);
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
  }

  &__sla-condition {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__sla-name {
    @extend %typo-body-1;
    //TODO: replace bold with actual font-weight after TYPOGRAPHY/body 1 bold is implemented
    font-weight: bold;
  }
}
</style>
