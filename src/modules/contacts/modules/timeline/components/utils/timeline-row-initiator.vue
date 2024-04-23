<template>
  <div class="timeline-row-initiator">
    <div v-if="type === TimelinePinTypeEnum.CALL_INBOUND_ON_IVR">
      <wt-icon
        icon="bot"
      ></wt-icon>
      <p>{{ text }}</p>
    </div>

    <div v-else-if="type === TimelinePinTypeEnum.CALL_MISSED_ON_QUEUE">
      <wt-chip
        color="secondary"
      >{{text}}</wt-chip>
    </div>

    <div v-else>
      <div class="timeline-row-initiator-user">
        <wt-avatar
          size="sm"
          :username="text" />
        <p class="timeline-row-initiator-user__name">{{ text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import TimelinePinTypeEnum from '../../enums/TimelinePinType.enum.js';

const props = defineProps({
  text: {
    type: String,
    default: TimelinePinTypeEnum.CALL_OUTBOUND,
  },
  type: {
    type: String,
  }
});
</script>

<style  lang="scss" scoped>
.timeline-row-initiator-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  &__name {
    @extend %typo-subtitle-1;
  }
}
</style>
