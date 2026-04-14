<template>
  <wt-context-menu
    :options="contextOptions"
    class="call-task-timeline-action-play-recording"
    max-width="400px"
    @click="handleOptionSelect"
  >
    <template #activator="{ toggle }">
      <wt-icon-btn
        v-tooltip="$t('timeline.actions.playRecording')"
        :icon="isAnyFilesPlaying ? 'stop' : recordingTypeIcon"
        @click="toggle"
      />
    </template>

    <template #option="{ text, id, mimeType }">
      <div class="call-task-timeline-action-play-recording__option">
        <wt-icon :icon="id === audioId ? 'stop' : getFileIcon(mimeType)" />

        {{ text }}
      </div>
    </template>
  </wt-context-menu>
</template>

<script lang="ts" setup>
import { getCallMediaUrl } from '@webitel/api-services/api';
import { EngineCallFile } from '@webitel/api-services/gen/models';
import { isAudioSrc, isVideoSrc } from 'vidstack';
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';

const eventBus = inject('$eventBus');
const audioId = inject('audioId'); // value from the-timeline.vue component
// [https://webitel.atlassian.net/browse/WTEL-4931]

const props = defineProps({
	files: {
		type: Array,
		required: true,
	},
});

const selectedRecording = ref<EngineCallFile | null>(null);

const currentFileId = computed(() => {
	return selectedRecording.value?.id || '';
});

const isAnyFilesPlaying = computed(() => {
	return props.files.some((file) => file.id === audioId.value);
});

const contextOptions = computed(() => {
	return props.files.map((file) => ({
		...file,
		text: file.name,
	}));
});

const getFileIcon = (mimeType: string) => {
	if (
		isVideoSrc({
			src: '',
			type: mimeType,
		})
	)
		return 'preview-tag-video';
	if (
		isAudioSrc({
			src: '',
			type: mimeType,
		})
	)
		return 'preview-tag-audio';
	return 'play';
};

const recordingTypeIcon = computed(() => {
	const hasVideoFile = props.files?.some((file) =>
		isVideoSrc({
			src: '',
			type: file.mimeType,
		}),
	);
	return hasVideoFile ? 'preview-tag-video' : 'play';
});

const closePlayer = () => {
	selectedRecording.value = null;
};

const handleOptionSelect = ({ option: file }: { option: EngineCallFile }) => {
	if (currentFileId.value === file.id) {
		closePlayer();
	} else {
		selectedRecording.value = file;
	}
	eventBus.$emit('media-source-handler', {
		url: getCallMediaUrl(file.id),
		file,
	});
};

onMounted(() => eventBus.$on('close-player', closePlayer));

onUnmounted(() => eventBus.$off('close-player', closePlayer));
</script>
<style
  lang="scss"
  scoped
>
.call-task-timeline-action-play-recording__option {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--spacing-xs);
  word-break: break-all;

  .wt-icon {
    flex: 1 0 auto;
  }
}
</style>
