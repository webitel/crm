<template>
  <div class="call-task-timeline-action-transcription">
    <wt-icon-btn
      v-tooltip="t('timeline.actions.transcription')"
      icon="docs"
      @click="openPopup"
    />

    <task-timeline-transcription-popup
      :shown="showPopup"
      :transcripts="transcripts"
      :created-at="createdAt"
      @close="closePopup"
    />
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import TaskTimelineTranscriptionPopup, {
	type CallTranscript,
} from './task-timeline-transcription-popup.vue';

const props = defineProps({
	transcripts: {
		type: Array as PropType<CallTranscript[]>,
		required: true,
	},
	createdAt: {
		type: String,
	},
});

const { t } = useI18n();

const showPopup = ref(false);

function openPopup() {
	showPopup.value = true;
}

function closePopup() {
	showPopup.value = false;
}
</script>

<style lang="scss" scoped>
.call-task-timeline-action-transcription {
  display: flex;
  align-items: center;
}
</style>
