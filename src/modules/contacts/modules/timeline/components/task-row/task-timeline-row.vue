<template>
  <component
    :is="component"
    :item="item"
  />
</template>

<script setup>
import { computed } from 'vue';
import ChatTaskTimelineRow from '../../modules/chats/components/task-row/chat-task-timeline-row.vue';
import CallTaskTimelineRow from './call-task-timeline-row.vue';
import { WebitelContactsTimelineEventType } from 'webitel-sdk';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const component = computed(() => {
  switch (props.item.type) {
    case WebitelContactsTimelineEventType.Chat: return ChatTaskTimelineRow;
    case WebitelContactsTimelineEventType.Call: return CallTaskTimelineRow;
   // default:
    //  return throw new Error(`Unknown item type, ${props.item.type}!`);
  }
});
</script>

<style lang="scss" scoped>

</style>
