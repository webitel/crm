<template>
  <div class="call-task-timeline-actions-history-link">
    <a
      v-tooltip="$t('timeline.actions.openInHistory')"
      :href="historyLink"
      target="_blank"
    >
      <wt-icon-btn
        icon="history"
      />
    </a>
  </div>
</template>
<script setup>

const props = defineProps({
  id: {
    type: Object,
    required: true,
  },
});

const historyLink = `${import.meta.env.VITE_HISTORY_URL}/${props.id}`;
</script>

<style lang="scss" scoped>
.call-task-timeline-actions-history-link {
  display: flex;
  align-items: center;
}
</style>
