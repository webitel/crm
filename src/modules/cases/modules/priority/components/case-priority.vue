<template>
  <div class="case-priority">
    <span class="case-priority__title">{{ t('cases.priority') }}</span>
    <div>
      <editable-field
        :edit-mode="editMode"
        :value="itemInstance.priority?.name"
        @update:value="setItemProp({ path: 'priority', value: $event });"
      >
        <template #default="props">
          <wt-select
            :clearable="false"
            :search-method="PriorityAPI.getLookup"
            class="case-priority__select"
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import EditableField from '../../case-info/components/editable-field.vue';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import PriorityAPI from '../api/PriorityAPI.js';

const { t } = useI18n();

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const {
  id,
  itemInstance,
  setItemProp,
} = useCardStore(props.namespace);

const editMode = inject('editMode');

async function initializePriority() {
  if (!itemInstance.value.priority) {
    try {
      const priority = await PriorityAPI.get({ itemId: 'p1' });
      await setItemProp({ path: 'priority', value: priority });
    } catch (err) {
      throw err
    }
  }
}

onMounted(() => {
  initializePriority();
});
</script>

<style lang="scss" scoped>
.case-priority {
  width: 100%;

  &__title {
    display: block;
    @extend %typo-heading-4;
  }

  &__select, &__title {
    padding: var(--spacing-xs);
  }
}
</style>
