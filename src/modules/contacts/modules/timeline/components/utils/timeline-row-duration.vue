<template>
  <div class="timeline-row-duration">
    <p class="timeline-row-duration__title">
      {{ t('vocabulary.duration') }}:
    </p>
    <span class="timeline-row-duration__value">
      {{ convertedDuration }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration.js';

const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
});

const { t } = useI18n();

const convertedDuration = computed(() => convertDuration(props.duration));
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
