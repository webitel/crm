<template>
  <component
    :is="component"
    :task="task"
    :last="last"
  />
</template>

<script setup>
import { computed } from 'vue';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';
import CallTaskTimelineRow from '../../modules/calls/components/task-row/call-task-timeline-row.vue';
import ChatTaskTimelineRow from '../../modules/chats/components/task-row/chat-task-timeline-row.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  last: {
    type: Boolean,
    default: false,
  },
});

const component = computed(() => {
  switch (props.task.type) {
    case WebitelContactsTimelineEventType.Chat:
      return ChatTaskTimelineRow;
    case WebitelContactsTimelineEventType.Call:
      return CallTaskTimelineRow;
    default:
      throw new Error(`Unknown item type, ${props.task.type}!`);
  }
});
</script>

<style lang="scss" scoped>

</style>
