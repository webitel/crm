<template>
  <wt-popup
    v-bind="$attrs"
    :shown="shown"
    class="task-timeline-transcription-popup"
    @close="$emit('close')"
  >
    <template #title>
      {{ t('timeline.actions.transcription') }}
    </template>
    <template #main>
      <div class="task-timeline-transcription-popup__options">
        <wt-select
          :value="activeTranscript"
          :clearable="false"
          :label="$t('vocabulary.file')"
          :options="transcriptData"
          option-label="fileName"
          track-by="fileId"
          @input="activeTranscript = $event"
        />
        <wt-icon-btn
          icon="stt-download"
          @click="downloadTxt(phraseData)"
        />
      </div>
      <wt-loader v-show="isLoading" />
      <div class="task-timeline-transcription-popup__table">
        <wt-table
          v-show="!isLoading"
          :data="phraseData"
          :headers="headers"
          :selectable="false"
          :grid-actions="false"
        />
      </div>
    </template>
  </wt-popup>
</template>

<script setup>
import { saveAs } from 'file-saver';
import { computed,onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import CallTranscriptAPI from './api/callTranscript.js';

const props = defineProps({
  transcripts: {
    type: Array,
  },
  createdAt: {
    type: String,
  },
  shown: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const activeTranscript = ref(null);
const phrases = ref([]);
const isLoading = ref(false);

const headers = computed(() => {
  return [
    {
      value: 'time',
      text: t('vocabulary.time'),
      width: '120px',
    },
    {
      value: 'channel',
      text: t('vocabulary.channel'),
      width: '140px',
    },
    {
      value: 'phrase',
      text: t('vocabulary.text'),
    },
  ];
});

const phraseData = computed(() => {
  return phrases.value.map(({
                              startSec, endSec, phrase, channel,
                            }) => ({
    time: `${startSec} - ${endSec}`,
    channel: channel
      ? (activeTranscript.value.to?.name || activeTranscript.value.to?.number || activeTranscript.value.to?.destination || 1)
      : (activeTranscript.value.from?.name || activeTranscript.value.from?.number || activeTranscript.value.from?.destination || 0),
    phrase,
  }));
});

const transcriptData = computed(() => {
  return props.transcripts.map((transcript) => ({
    fileName: transcript.file.name,
    fileId: transcript.file.id,
    id: transcript.id,
    locale: transcript.locale,
  }));
});

function downloadTxt(phrases) {
  const text = phrases.map(({ phrase, channel, time }) => (
    `${time} [${channel != null ? channel : 'author'}] ${phrase || ''}`
  )).join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  return saveAs(blob, `Transcript ${activeTranscript.value?.id} ${props.createdAt}`);
}

async function loadCallTranscript() {
  try {
    isLoading.value = true;
    phrases.value = await CallTranscriptAPI.get({ id: activeTranscript.value?.id });
  } finally {
    isLoading.value = false;
  }
};

function initTranscript() {
  activeTranscript.value = transcriptData.value[0];
}

onMounted(() => initTranscript());

watch(() => activeTranscript.value, (value) => {
  if (value) return loadCallTranscript();
  return phrases.value = [];
});

</script>

<style lang="scss" scoped>
.task-timeline-transcription-popup {
  &__options {
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-sm);
    justify-content: space-between;
    margin-bottom: var(--spacing-sm);
  }

  &__table {
    @extend %wt-scrollbar;
    overflow: auto;
    max-height: 40vh;
  }
}
</style>
