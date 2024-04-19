<template>
  <div class="day-timeline-row-counters">
    <div class="day-timeline-row-counters__wrapper">
      <span>Calls: {{ props.callsCount }}</span>
      <span>Chats: {{ props.chatsCount }}</span>
    </div>
  </div>
</template>

<script setup>
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
</script>

<style scoped lang="scss">
.day-timeline-row-counters {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
}

.day-timeline-row-counters__wrapper {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
