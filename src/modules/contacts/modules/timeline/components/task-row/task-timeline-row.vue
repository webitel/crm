<template>
  <component
    :is="component"
    :task="task"
  />
</template>

<script setup>
import { computed } from 'vue';
import ChatTaskTimelineRow from '../../modules/chats/components/task-row/chat-task-timeline-row.vue';
import CallTaskTimelineRow from './call-task-timeline-row.vue';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const component = computed(() => {
  switch (props.task.type) {
    case WebitelContactsTimelineEventType.Chat: return ChatTaskTimelineRow;
    case WebitelContactsTimelineEventType.Call: return CallTaskTimelineRow;
    default: throw new Error(`Unknown item type, ${props.task.type}!`);
  }
});
</script>

<style lang="scss" scoped>

</style>
