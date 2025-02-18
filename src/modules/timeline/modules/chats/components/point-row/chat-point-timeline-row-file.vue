<template>
  <div class="chat-point-timeline-row-file">
      <wt-icon
        :icon="icon"
      />
      <span
        class="chat-point-timeline-row-file__name"
        @click="downloadFile({ id: file?.id, name: file?.name, type: file?.type, url: file?.url })"
      >{{ props.file.name }}</span>
    </div>
</template>

<script setup>
import { computed } from 'vue';

import downloadFile from '../../../../../../app/utils/downloadFile.js';

const props = defineProps({
  file: {
    type: Object,
    required: true,
  },
});

const icon = computed(() => {
  if (props.file.type.includes('image')) return 'preview-tag-image';
  if (props.file.type.includes('video')) return 'preview-tag-video';
  if (props.file.type.includes('audio')) return 'preview-tag-audio';
  return 'attach';
})
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
