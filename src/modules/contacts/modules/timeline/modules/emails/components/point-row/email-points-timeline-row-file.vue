<template>
  <div class="email-points-timeline-row-file">
    <div class="email-points-timeline-row-file__wrapper">

      <wt-icon
        :icon="icon"
      />
      <span class="email-points-timeline-row-file__name" @click="openFileInNewTab">{{ file.name }}</span>
    </div>

    <span >{{ prettifyFileSize(file.size) }}</span>

    <wt-icon-btn
      icon="download"
      class="email-points-timeline-row-file__icon"
      @click="downloadFile({ id: file?.id, name: file?.name })"
    ></wt-icon-btn>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import downloadFile from '../../../../utils/downloadFile.js';

const props = defineProps({
  file: {
    type: Array,
    required: true,
  },
});

const icon = computed(() => {
  if (props.file.mime.includes('image')) return 'preview-tag-image';
  if (props.file.mime.includes('video')) return 'preview-tag-video';
  if (props.file.mime.includes('audio')) return 'preview-tag-audio';
  return 'attach';
});

const openFileInNewTab = async () => {
  const link = document.createElement('a');
  const token = localStorage.getItem('access-token');
  const url = `${import.meta.env.VITE_API_URL}/storage/file/${props.file.id}/download?access_token=${token}`;

  const file = await fetch(url)
  .then((res) => res.blob())
  .then((res) => new File([res], props.file.name, { type: res.type }));

  const blob = new Blob([file], { type: file.type });
  link.href = URL.createObjectURL(blob);
  window.open(link.href, '_blank');
};

</script>

<style scoped lang="scss">
.email-points-timeline-row-file {
  display: grid;
  grid-template-columns: 8fr 1fr 1fr;

  &__wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__icon {
    justify-self: flex-end;
  }

  &__name {
    color: var(--info-color);
    cursor: pointer;

    &:hover {
      color: var(--info-hover-color);
    }
  }
}
</style>
