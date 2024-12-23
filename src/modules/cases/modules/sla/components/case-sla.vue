<template>
  <div class="case-sla">
    <span class="case-sla__title">{{ t('cases.appliedSLA') }}</span>
    <div
      v-if="itemInstance.sla"
      class="case-sla__content"
    >
      <div class="case-sla__name">
        <span>{{ itemInstance?.sla?.name }}</span>
      </div>
      <template v-if="itemInstance?.slaCondition?.name">
        <div
          class="case-sla__condition"
        >
          <wt-icon
            color="error"
            icon="stop-sign"
          />
          <span>
            {{ itemInstance.slaCondition.name }}
          </span>
        </div>
      </template>
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
  setItemProp,
  ...restStore
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
  ...restStore,
});

const { t } = useI18n();

const store = useStore();
const serviceSLA = computed(() => store.getters[`${props.namespace}/service/SLA`]);


const updateSlaCondition = async (slaId, priorityId) => {
  if (!slaId || !priorityId) {
    await resetSlaCondition();
    return;
  }

  try {
    const response = await slaConditionsAPI.getList({ slaId });
    const matchingCondition = response.items.find(condition =>
      condition.priorities.some(priority => priority.id === priorityId),
    );

    await setItemProp({ path: 'slaCondition', value: matchingCondition });
  } catch (err) {
    await resetSlaCondition();
    throw err;
  }
};

const resetSlaCondition = async () => {
  await setItemProp({ path: 'slaCondition', value: null });
};

const resetSla = async () => {
  await setItemProp({ path: 'sla', value: null });
};

watch(
  () => serviceSLA.value?.id,
  async (newSlaId) => {
    if (!newSlaId) {
      await resetSla();
      return;
    }

    try {
      await setItemProp({ path: 'sla', value: serviceSLA.value });
      await updateSlaCondition(newSlaId, itemInstance.value.priority?.id);
    } catch (err) {
      throw err;
    }
  },
);

watch(
  () => itemInstance.value.priority?.id,
  async (newPriorityId) => {
    try {
      await updateSlaCondition(serviceSLA.value?.id, newPriorityId);
    } catch (err) {
      throw err;
    }
  },
);

initialize();
</script>

<style lang="scss" scoped>
.case-sla {
  width: 100%;

  &__title {
    display: block;
    @extend %typo-heading-4;
    padding: var(--spacing-xs);
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
  }

  &__condition {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__name {
    @extend %typo-body-1;
    //TODO: replace bold with actual font-weight after TYPOGRAPHY/body 1 bold is implemented
    font-weight: bold;
  }
}
</style>
