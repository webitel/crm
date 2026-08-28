<template>
  <div class="email-points-timeline-row-file">
    <div class="email-points-timeline-row-file__wrapper">

      <wt-icon
        :icon="icon"
      />
      <span class="email-points-timeline-row-file__name" @click="openStorageFileInNewTab(props.file)">{{ file.name }}</span>
    </div>

    <span >{{ prettifyFileSize(file.size) }}</span>

    <wt-icon-btn
      icon="download"
      class="email-points-timeline-row-file__icon"
      @click="downloadStorageFile({ id: file?.id, name: file?.name, type: file?.mime })"
    ></wt-icon-btn>

  </div>
</template>

<script setup lang="ts">
import {
	downloadStorageFile,
	getFileTypeIcon,
	openStorageFileInNewTab,
} from '@webitel/ui-sdk/scripts';
import prettifyFileSize from '@webitel/ui-sdk/src/scripts/prettifyFileSize';
import { computed, type PropType } from 'vue';

export interface EmailFile {
	id: string;
	name: string;
	size: number;
	mime: string;
}

const props = defineProps({
	file: {
		type: Object as PropType<EmailFile>,
		required: true,
	},
});

const icon = computed(() => getFileTypeIcon(props.file.mime));
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
