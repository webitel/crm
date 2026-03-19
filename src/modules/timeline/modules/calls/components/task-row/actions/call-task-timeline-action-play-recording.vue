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
        :icon="isAnyFilesPlaying ? 'stop' : getRecordingTypeIcon"
        @click="toggle"
      />
    </template>

    <template #option="{ text, id }">
      <div class="call-task-timeline-action-play-recording__option">
        <wt-icon :icon="id === audioId ? 'stop' : getRecordingTypeIcon" />
        {{ text }}
      </div>
    </template>
  </wt-context-menu>
</template>

<script lang="ts" setup>
import { getCallMediaUrl } from '@webitel/api-services/api';
import { EngineCallFile } from '@webitel/api-services/gen/models';
import { isVideoSrc } from 'vidstack';
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

const getRecordingTypeIcon = computed(() => {
	const isVideoFile = props.files?.find((file) =>
		isVideoSrc({
			src: '',
			type: file.mimeType,
		}),
	);
	return isVideoFile ? 'preview-tag-video' : 'play';
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
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
