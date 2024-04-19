<template>
  <div>
    <div v-if="isCallInboundFromIvrType">
      <wt-icon
        icon="account"
      ></wt-icon>
      <p>{{name}}</p>
    </div>

    <div v-else-if="isCallMissedFromQueueType">
      <wt-chip
        color="secondary"
      >{{name}}</wt-chip>
    </div>

    <div v-else>
      <div class="event-initiator-name-user">
        <wt-avatar
          size="sm"
          :username="name" />
        <p class="event-initiator-name-user__name">{{name}}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  eventType: {
    type: String,
    default: 'call-outbound', //?дізнатись яке дефолтне
  },
  name: {
    type: String,
  },
});

const { name, eventType } = props;

const isCallMissedFromQueueType = computed(() => eventType === 'call-missed-from-queue');
const isCallInboundFromIvrType = computed(() => eventType === 'call-inbound-from-ivr');
</script>

<style  lang="scss" scoped>
.event-initiator-name-user {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  &__name {
    @extend %typo-subtitle-1;
  }
}
</style>
