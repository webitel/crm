<template>
  <div class="day-timeline-row-counters">
    <div class="day-timeline-row-counters__wrapper">
      <span>
        {{ `${t(`contacts.timeline.eventType.${WebitelContactsTimelineEventType.Call}`, 2)}: (${props.callsCount})` }}
      </span>
      <span>
        {{ `${t(`contacts.timeline.eventType.${WebitelContactsTimelineEventType.Chat}`, 2)}: (${props.chatsCount})`}}
      </span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';

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
$colWidth: 80px;

.day-timeline-row-counters {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;

  &__wrapper {
    @extend %typo-body-2;
    display: grid;
    grid-template-columns: repeat(2, $colWidth);
    gap: var(--spacing-xs);
    text-align: right;
  }
}
</style>
