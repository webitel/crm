<template>
  <template>
    <div class="case-number">
      <span class="case-number__title">{{ t('cases.caseNumber') }}</span>
      <div class="case-number__wrapper">
        <p>{{ itemInstance.name }}</p>
        <wt-copy-action
          :value="itemInstance.name"
        />
      </div>
    </div>
  </template>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/modules/CardStoreModule/composables/useCardStore.js';
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';

const namespace = inject('namespace');

const {
  namespace: cardNamespace,

  id,
  itemInstance,
} = useCardStore(namespace);

const { t } = useI18n();
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-number {
  width: 100%;

  &__title {
    display: block;
    @extend %typo-heading-4;
    padding: var(--spacing-xs);
  }

  &__wrapper {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-xs);
  }
}
</style>
