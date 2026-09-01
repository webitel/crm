<template>
  <div class="timeline-task-info-transcription">
    <div class="timeline-task-info-transcription__options">
      <wt-single-select
        v-model:model-value="activeTranscript"
        :show-clear="false"
        :options="activeTranscriptOptions"
        option-label="fileName"
        data-key="fileId"
      />
      <wt-icon-btn
        :disabled="!activeTranscript"
        icon="stt-download"
        @click="downloadTxt(dataList)"
      />
      <wt-icon-btn
        :disabled="!activeTranscript"
        icon="bucket"
        @click="deleteActiveTranscript"
      />
    </div>
    <wt-empty
      v-show="showEmpty"
      :image="emptyImage"
      :text="emptyText"
    />
    <wt-loader v-show="isLoading" />
    <wt-table
      v-show="!showEmpty && !isLoading"
      class="timeline-task-info-transcription__table wt-scrollbar"
      :data="dataList"
      :headers="headers"
      :selectable="false"
      :grid-actions="false"
      striped-rows
      headless
    />
  </div>
</template>

<script setup lang="ts">
import { CallTranscriptAPI } from '@webitel/api-services/api';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import { saveAs } from 'file-saver';
import { computed, ref, watch } from 'vue';

import { useTimelineStore } from '../../stores/timeline';
import type { TimelineTask } from '../../types/timeline.types';
import type {
	TranscriptOption,
	TranscriptPhrase,
} from '../../types/transcript.types';

const props = defineProps<{
	task: TimelineTask;
}>();

const emit = defineEmits<{
	'empty-list': [];
}>();

const { removeTranscript } = useTimelineStore();

const dataList = ref<TranscriptPhrase[]>([]);
const isLoading = ref(false);

const headers = [
	{
		value: 'time',
		width: '120px',
	},
	{
		value: 'phrase',
	},
];

const activeTranscriptOptions = computed<TranscriptOption[]>(() =>
	(props.task.transcripts ?? []).map((transcript) => ({
		fileName: transcript.file.name,
		fileId: transcript.file.id,
		id: transcript.id,
		locale: transcript.locale,
	})),
);

const activeTranscript = ref<TranscriptOption | null>(
	activeTranscriptOptions.value[0] ?? null,
);

const {
	showEmpty,
	image: emptyImage,
	text: emptyText,
} = useTableEmpty({
	dataList,
});

function downloadTxt(phrases: TranscriptPhrase[]) {
	const text = phrases
		.map(({ phrase, time }) => `${time} ${phrase || ''}`)
		.join('\n');
	const blob = new Blob(
		[
			text,
		],
		{
			type: 'text/plain;charset=utf-8',
		},
	);
	return saveAs(
		blob,
		`Transcript ${activeTranscript.value?.id} ${props.task.createdAt}`,
	);
}

async function loadCallTranscript() {
	try {
		isLoading.value = true;
		const callTranscripts = await CallTranscriptAPI.get({
			id: activeTranscript.value?.id,
		});
		dataList.value = callTranscripts.map(({ startSec, endSec, phrase }) => ({
			time: `${startSec} - ${endSec}`,
			phrase,
		}));
	} catch {
		dataList.value = [];
	} finally {
		isLoading.value = false;
	}
}

async function deleteActiveTranscript() {
	try {
		isLoading.value = true;
		await CallTranscriptAPI.delete({
			fileId: activeTranscript.value.id,
		});
		removeTranscript({
			taskId: props.task.id,
			id: activeTranscript.value.id,
		});
		if (activeTranscriptOptions.value.length) {
			activeTranscript.value = activeTranscriptOptions.value[0];
		} else {
			emit('empty-list');
		}
	} finally {
		isLoading.value = false;
	}
}

watch(
	() => activeTranscript.value,
	(value) => {
		if (value) return loadCallTranscript();
		dataList.value = [];
	},
	{
		immediate: true,
	},
);
</script>

<style scoped>
.timeline-task-info-transcription {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.timeline-task-info-transcription__options {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-xs);
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.timeline-task-info-transcription__table {
  flex: 1;
  min-height: 0;
}
</style>
