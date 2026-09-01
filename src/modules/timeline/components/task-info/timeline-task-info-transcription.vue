<template>
  <div
    v-if="activeTranscriptOptions.length"
    class="timeline-task-info-transcription"
  >
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
        @click="downloadTxt(phrases)"
      />
      <wt-icon-btn
        :disabled="!activeTranscript"
        icon="bucket"
        @click="deleteActiveTranscript"
      />
    </div>
    <wt-loader v-show="isLoading" />
    <wt-table
      v-show="!isLoading"
      class="timeline-task-info-transcription__table wt-scrollbar"
      :data="phrases"
      :headers="headers"
      :selectable="false"
      :grid-actions="false"
      striped-rows
      headless
    />
  </div>
  <wt-empty
    v-else
    :text="t('webitelUI.empty.text.empty')"
  />
</template>

<script setup>
import { CallTranscriptAPI } from '@webitel/api-services/api';
import { saveAs } from 'file-saver';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const props = defineProps({
	task: {
		type: Object,
		required: true,
	},
});

const { t } = useI18n();
const store = useStore();

const phrases = ref([]);
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

const activeTranscriptOptions = computed(() =>
	props.task.transcripts.map((transcript) => ({
		fileName: transcript.file.name,
		fileId: transcript.file.id,
		id: transcript.id,
		locale: transcript.locale,
	})),
);

const activeTranscript = ref(activeTranscriptOptions.value[0] ?? null);

function downloadTxt(phrases) {
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
		phrases.value = callTranscripts.map(({ startSec, endSec, phrase }) => ({
			time: `${startSec} - ${endSec}`,
			phrase,
		}));
	} catch {
		phrases.value = [];
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
		store.commit('timeline/REMOVE_TRANSCRIPT', {
			taskId: props.task.id,
			fileId: activeTranscript.value.fileId,
		});
		activeTranscript.value = activeTranscriptOptions.value[0] ?? null;
	} finally {
		isLoading.value = false;
	}
}

watch(
	() => activeTranscript.value,
	(value) => {
		if (value) return loadCallTranscript();
		phrases.value = [];
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
