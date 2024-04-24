<template>
  <div class="timeline-row-duration">
    <p class="timeline-row-duration__title">{{ t('vocabulary.duration') }}:</p>
    <span class="timeline-row-duration__value">{{ ConvertDuration(duration) }}</span>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import ConvertDuration from '@webitel/ui-sdk/src/scripts/convertDuration.js';

const props = defineProps({
  duration: {
    type: Number,
  },
});

const { t } = useI18n();
</script>

<style scoped lang="scss">
.timeline-row-duration {
  display: flex;
  gap: var(--spacing-sm);
  margin: auto 0;

  &__title {
    @extend %typo-subtitle-1;
  }
  &__value {
    @extend %typo-body-1;
  }
}
</style>
