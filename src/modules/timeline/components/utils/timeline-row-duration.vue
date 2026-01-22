<template>
  <div class="timeline-row-duration">
    <p class="timeline-row-duration__title typo-subtitle-1">
      {{
        isTotalDuration
          ? t('timeline.totalDuration')
          : t('vocabulary.duration')
      }}:
    </p>
    <span class="timeline-row-duration__value typo-body-1">
      {{ convertedDuration }}
    </span>
  </div>
</template>

<script setup>
import convertDuration from '@webitel/ui-sdk/src/scripts/convertDuration.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  duration: {
    type: Number,
    required: true,
  },
  isTotalDuration: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const convertedDuration = computed(() => convertDuration(props.duration));
</script>

<style
  scoped
  lang="scss"
>
@use '@webitel/ui-sdk/src/css/main' as *;

.timeline-row-duration {
  display: flex;
  gap: var(--spacing-sm);
  margin: auto 0;

}
</style>
