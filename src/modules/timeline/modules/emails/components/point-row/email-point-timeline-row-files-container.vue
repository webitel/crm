<template>
  <div class="email-point-timeline-row-files-container">
    <wt-divider />

    <div class="email-point-timeline-row-files-container__wrapper">
      <email-point-timeline-row-file
        v-for="file of files"
        :key="file.id"
        :file="file"
      />
    </div>

  </div>
</template>

<script setup>
import EmailPointTimelineRowFile from './email-point-timeline-row-file.vue';

const props = defineProps({
	files: {
		type: Array,
		required: true,
	},
});
</script>

<style scoped lang="scss">
.email-point-timeline-row-files-container,
.email-point-timeline-row-files-container__wrapper {
  display: flex;
  gap: var(--spacing-xs);
  flex-direction: column;
}
</style>
