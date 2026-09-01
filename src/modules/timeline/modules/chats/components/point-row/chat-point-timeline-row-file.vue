<template>
  <div class="chat-point-timeline-row-file">
      <wt-icon
        :icon="icon"
      />
      <span
        class="chat-point-timeline-row-file__name"
        @click="downloadStorageFile({ id: file?.id, name: file?.name, type: file?.type, url: file?.url })"
      >{{ props.file.name }}</span>
    </div>
</template>

<script setup lang="ts">
import {
	downloadStorageFile,
	getFileTypeIcon,
} from '@webitel/ui-sdk/scripts/file';
import { computed } from 'vue';

const props = defineProps({
	file: {
		type: Object,
		required: true,
	},
});

const icon = computed(() => getFileTypeIcon(props.file.type));
</script>

<style scoped lang="scss">
.chat-point-timeline-row-file {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  &__name {
    color: var(--info-color);
    cursor: pointer;

    &:hover {
      color: var(--info-hover-color);
    }
  }
}
</style>
