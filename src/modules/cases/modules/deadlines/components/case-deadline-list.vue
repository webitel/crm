<template>
  <div class="case-deadline-list">
    <span class="case-deadline-list__title">{{ t('cases.deadlines') }}</span>
    <div class="case-deadline-list__wrapper">
      <case-deadline
        :time="itemInstance?.createdAt"
        :label="t('reusable.createdAt')"
      />
      <case-deadline
        :time-difference="itemInstance?.timing?.differenceInReaction"
        :time="itemInstance?.plannedReactionAt"
        :label="t('cases.reactionTime')"
      />
      <case-deadline
        :time="itemInstance?.timing?.reactedAt"
        :label="t('cases.actualReactionTime')"
      />

      <case-deadline
        :time-difference="itemInstance?.timing?.differenceInResolve"
        :time="itemInstance?.plannedResolveAt"
        :label="t('cases.resolutionTime')"
      />

      <case-deadline
        :time="itemInstance?.timing?.resolvedAt"
        :label="t('cases.actualResolutionTime')"
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

const {
  itemInstance,
} = useCardStore(namespace);
</script>

<style lang="scss" scoped>
.case-deadline-list {
  width: 100%;

  &__title {
    display: block;
    @extend %typo-heading-4;
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
