<template>
  <wt-context-menu
    :options="contextOptions"
    class="call-task-timeline-action-play-recording"
    max-width="400px"
    @click="handleOptionSelect"
  >
    <template #activator="{ toggle }">
      <wt-icon-btn
        v-if="recordingFiles.length"
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
import {
	EngineCallFile,
	EngineCallFileType,
} from '@webitel/api-services/gen/models';
import type { eventBus as EventBus } from '@webitel/ui-sdk/scripts';
import {
	assumeVidstackSupportedAudioType,
	assumeVidstackSupportedVideoType,
} from '@webitel/ui-sdk/src/components/wt-vidstack-player/utils/normalizeVidstackMediaSrc';
import {
	type ComputedRef,
	computed,
	inject,
	onMounted,
	onUnmounted,
	ref,
} from 'vue';

const eventBus = inject<typeof EventBus>('$eventBus');
// value from call-task-timeline-row.vue component
// [https://webitel.atlassian.net/browse/WTEL-4931]
const audioId = inject<ComputedRef<EngineCallFile['id']>>('audioId');

const props = defineProps<{
	files: EngineCallFile[];
}>();

const selectedRecording = ref<EngineCallFile | null>(null);

const currentFileId = computed(() => {
	return selectedRecording.value?.id || '';
});

const isAnyFilesPlaying = computed(() => {
	return recordingFiles.value.some((file) => file.id === audioId.value);
});

const contextOptions = computed(() => {
	return recordingFiles.value.map((file) => ({
		...file,
		text: file.name,
	}));
});

const isMimeTypeVideo = (mimeType: string) =>
	assumeVidstackSupportedVideoType({
		src: '',
		type: mimeType,
	});
const isMimeTypeAudio = (mimeType: string) =>
	assumeVidstackSupportedAudioType({
		src: '',
		type: mimeType,
	});

const getFileIcon = (mimeType: string) => {
	if (isMimeTypeVideo(mimeType)) return 'preview-tag-video';
	if (isMimeTypeAudio(mimeType)) return 'preview-tag-audio';
	return 'play';
};

const recordingTypeIcon = computed(() => {
	const hasVideoFile = recordingFiles.value.some((file) =>
		isMimeTypeVideo(file.mimeType),
	);
	return hasVideoFile ? 'preview-tag-video' : 'play';
});

const isPlayableRecording = (file: EngineCallFile) => {
	if (file.type) {
		return (
			file.type === EngineCallFileType.FileTypeAudio ||
			file.type === EngineCallFileType.FileTypeVideo
		);
	}

	return isMimeTypeAudio(file.mimeType) || isMimeTypeVideo(file.mimeType);
};

const recordingFiles = computed(() => props.files.filter(isPlayableRecording));

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
