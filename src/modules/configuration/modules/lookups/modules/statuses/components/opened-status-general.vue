<template>
  <section class="opened-status-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>

    <div
      class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50"
    >
      <wt-input
        :label="t('reusable.name')"
        :value="itemInstance.name"
        :v="v.itemInstance.name"
        :disabled="disableUserInput"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :model-value="itemInstance.description"
        :disabled="disableUserInput"
        @update:model-value="setItemProp({ path: 'description', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  v: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();

const { disableUserInput } = useUserAccessControl();

const { itemInstance, setItemProp } = useCardStore(props.namespace);
</script>

<style lang="scss" scoped>
// TODO: temporary solution. Will be fixed with typography
.opened-status-general {
  :deep(.wt-textarea__textarea) {
    min-height: 120px;
  }

  &__wrapper {
    grid-row-gap: 0;
  }
}
</style>
