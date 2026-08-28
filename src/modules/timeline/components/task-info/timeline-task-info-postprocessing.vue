<template>
  <div class="timeline-task-info-postprocessing wt-scrollbar">
    <template
      v-for="(entry, index) in postprocessing"
      :key="index"
    >
      <div class="timeline-task-info-postprocessing__agent-name typo-subtitle-1">
        <wt-icon icon="agent" />
        {{ entry.agent?.name }}
      </div>

      <template
        v-for="[key, value] in entryFields(entry)"
        :key="key"
      >
        <div class="timeline-task-info-postprocessing__field">
          <p class="typo-subtitle-1">
            {{ key }}:
          </p>
          <p class="typo-body-1">
            {{ JSON.stringify(value) }}
          </p>
        </div>

        <wt-divider />
      </template>
    </template>
  </div>
</template>

<script setup>
defineProps({
	postprocessing: {
		type: Array,
		default: () => [],
	},
});

function entryFields(entry) {
	return Object.entries(entry).filter(([key]) => key !== 'agent');
}
</script>

<style scoped>
.timeline-task-info-postprocessing {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 0;
  overflow: auto;
}

.timeline-task-info-postprocessing__agent-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-2xs);
}

.timeline-task-info-postprocessing__field {
  display: flex;
  gap: var(--spacing-2xs);
}
</style>
