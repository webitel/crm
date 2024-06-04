<template>
  <div class="chat-point-timeline-row-file">
      <wt-icon
        :icon="icon"
      />
      <span
        @click="download"
        class="chat-point-timeline-row-file__name"
      >{{ props.file.name }}</span>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const API_URL = import.meta.env.VITE_API_URL;

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

function download() {
  const a = document.createElement('a');
  const token = localStorage.getItem('access-token');
  a.href = `${API_URL}/storage/file/${props.file.id}/download?access_token=${token}`;
  a.target = '_blank';
  a.download = props.file.name;
  a.click();
}
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
