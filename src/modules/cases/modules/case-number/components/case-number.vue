<template>
  <template>
    <div class="case-number">
      <span class="case-number__title case-section-title">{{ t('cases.caseNumber') }}</span>
      <div class="case-number__wrapper">
        <p>{{ modelValue.name }}</p>
        <wt-copy-action :value="modelValue.name" />
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { useI18n } from 'vue-i18n';

import { useCasesCardStore } from '../../../stores/card/casesCardStore';

const { modelValue } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});

const { t } = useI18n();
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-number {
  width: 100%;

  &__title {
    display: block;
    padding: var(--spacing-xs);
  }

  &__wrapper {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-xs);
  }
}
</style>
