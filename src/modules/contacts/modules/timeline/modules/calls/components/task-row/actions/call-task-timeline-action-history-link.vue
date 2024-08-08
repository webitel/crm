<template>
  <div class="call-task-timeline-actions-history-link">
    <wt-tooltip>
      <template #activator>
        <a
          :href="historyLink"
          target="_blank"
        >
          <wt-icon-btn
            icon="link"
          />
        </a>
      </template>
      {{ $t('contacts.timeline.actions.openInHistory') }}
    </wt-tooltip>
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
