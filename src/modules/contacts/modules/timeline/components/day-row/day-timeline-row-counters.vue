<template>
  <div class="day-timeline-row-counters">
    <div class="day-timeline-row-counters__wrapper">
      <span>{{ `${t('channel.type.call')}: ${props.callsCount} `}}</span>
      <span>{{ `${t('channel.type.chat')}: ${props.chatsCount} `}}</span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  callsCount: {
    type: Number,
    default: 0,
  },
  chatsCount: {
    type: Number,
    default: 0,
  },
});

const { t } = useI18n();
</script>

<style scoped lang="scss">
.day-timeline-row-counters {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;

  &__wrapper {
    @extend %typo-body-2;
    display: flex;
    gap: var(--spacing-xs);
  }
}
</style>
