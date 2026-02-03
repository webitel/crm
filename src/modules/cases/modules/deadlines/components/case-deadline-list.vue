<template>
  <div class="case-deadline-list">
    <span class="case-deadline-list__title typo-heading-4">{{ t('cases.deadlines') }}</span>
    <div class="case-deadline-list__wrapper">
      <case-deadline
        :time="itemInstance?.createdAt"
        :title="t('reusable.createdAt')"
      />
      <case-deadline
        :time="itemInstance?.plannedReactionAt"
        :title="t('cases.reactionTime')"
      />
      <case-deadline
        :time-difference="itemInstance?.reactedAt ? (itemInstance?.differenceInReaction || 0) : null"
        :time="itemInstance?.reactedAt"
        :title="t('cases.actualReactionTime')"
      />

      <case-deadline
        :time="itemInstance?.plannedResolveAt"
        :title="t('cases.resolutionTime')"
      />

      <case-deadline
        :time-difference="itemInstance?.resolvedAt ? (itemInstance.differenceInResolve || 0) : null"
        :time="itemInstance.resolvedAt"
        :title="t('cases.actualResolutionTime')"
      />
    </div>
  </div>
</template>
<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';

import CaseDeadline from './case-deadline.vue';

const { t } = useI18n();

const namespace = inject('namespace');

const { itemInstance } = useCardStore(namespace);
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-deadline-list {
  width: 100%;

  &__title {
    display: block;
    padding: var(--spacing-xs);
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
  }
}
</style>
