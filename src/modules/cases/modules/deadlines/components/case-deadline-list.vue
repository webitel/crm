<template>
  <div class="case-deadline-list">
    <span class="case-deadline-list__title case-section-title">{{ t('cases.deadlines') }}</span>
    <div class="case-deadline-list__wrapper">
      <case-deadline
        :time="modelValue?.createdAt"
        :title="t('reusable.createdAt')"
      />
      <case-deadline
        :time="modelValue?.plannedReactionAt"
        :title="t('cases.reactionTime')"
      />
      <case-deadline
        :time-difference="reactionTimeDifference"
        :time="modelValue?.reactedAt"
        :title="t('cases.actualReactionTime')"
      />

      <case-deadline
        :time="modelValue?.plannedResolveAt"
        :title="t('cases.resolutionTime')"
      />

      <case-deadline
        :time-difference="resolutionTimeDifference"
        :time="modelValue.resolvedAt"
        :title="t('cases.actualResolutionTime')"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { WebitelCasesCase } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-datalist/card';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCasesCardStore } from '../../../stores/card/casesCardStore';
import CaseDeadline from './case-deadline.vue';

const { t } = useI18n();

const { modelValue } = useCardComponent<WebitelCasesCase>({
	useCardStore: useCasesCardStore,
	manualSetup: true,
});

const reactionTimeDifference = computed(() =>
	modelValue.value?.reactedAt
		? modelValue.value.differenceInReaction || 0
		: null,
);

const resolutionTimeDifference = computed(() =>
	modelValue.value?.resolvedAt
		? modelValue.value.differenceInResolve || 0
		: null,
);
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
