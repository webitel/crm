<template>
  <component
    :is="component"
    :task="item"
  />
</template>

<script setup>
import { computed } from 'vue';
import ChatTaskTimelineRow from './chat-task-timeline-row.vue';
import CallTaskTimelineRow from './call-task-timeline-row.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const component = computed(() => {
  switch (props.item.type) {
    case 'chat': // TODO Yehor enum
      return ChatTaskTimelineRow;
    case 'call':  // TODO Yehor enum
      return CallTaskTimelineRow;
   // default:
    //  return throw new Error(`Unknown item type, ${props.item.type}!`);
  }
});
</script>

<style lang="scss" scoped>

</style>
