<template>
  <div class="timeline-row-initiator">
    <div
      v-if="isDisplayBotName"
      class="timeline-row-initiator-bot"
    >
      <div class="timeline-row-initiator-bot__icon">
        <wt-icon
          icon="bot"
        ></wt-icon>

      </div>
      <p>{{ text }}</p>
    </div>

    <div v-else-if="isDisplayFlowSchemeName">
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
import { computed } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: TimelinePinTypeEnum.CALL_OUTBOUND,
  },
  type: {
    type: String,
  }
});

const isDisplayBotName = computed(() => props.type === TimelinePinTypeEnum.CALL_INBOUND_ON_IVR || props.type === TimelinePinTypeEnum.CHAT_GATEWAY);
const isDisplayFlowSchemeName = computed(() => props.type === TimelinePinTypeEnum.CALL_MISSED_ON_QUEUE);
</script>

<style  lang="scss" scoped>
.timeline-row-initiator {
  &-user {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);

    &__name {
      @extend %typo-subtitle-1;
    }
  }

  &-bot {
    display: flex;
    gap: var(--spacing-xs);
    align-items: center;

    &__icon {
      background-color: var(--secondary-color);
      padding: var(--spacing-xs);
      border-radius: 50%;
      height: 40px; ///?
    }
  }
}

</style>
