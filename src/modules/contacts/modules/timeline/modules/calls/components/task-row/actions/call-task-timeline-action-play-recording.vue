<template>
  <wt-context-menu
    class="call-task-timeline-action-play-recording"
    :options="contextOptions"
    max-width="400px"
    @click="handleOptionSelect"
  >
    <template #activator>
      <wt-tooltip>
        <template #activator>
          <wt-icon-btn
            :icon="isAnyFilesPlaying ? 'stop': 'play'"
          />
        </template>
        {{ $t('contacts.timeline.actions.playRecording') }}
      </wt-tooltip>
    </template>
    <template #option="{ text, id }">
      <div class="call-task-timeline-action-play-recording__option">
        <wt-icon
          :icon="id === audioId ? 'stop' : 'play'"
        />
        {{ text }}
      </div>
    </template>
  </wt-context-menu>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import generateMediaURL from '../../../../../../../../../app/scripts/generateMediaURL.js';

const eventBus = inject('$eventBus');
const audioId = inject('audioId'); // value from the-timeline.vue component
// [https://webitel.atlassian.net/browse/WTEL-4931]

const props = defineProps({
  files: {
    type: Array,
    required: true,
  },
});

const currentFileId = ref(''); // local value
const audioURL = ref('');

const isAnyFilesPlaying = computed(() => {
  return props.files.some((file) => file.id === audioId.value);
});

const contextOptions = computed(() => {
  return props.files.map(({ name, id }) => ({ text: name, id }));
});

const closePlayer = () => {
  currentFileId.value = '';
  audioURL.value = '';
};

const openPlayer = (id) => {
  if (id) {
    currentFileId.value = id;
    audioURL.value = generateMediaURL(id);
  } else {
    closePlayer();
  }
};

const handleOptionSelect = ({ option }) => {
  if (audioId.value === option.id) {
    closePlayer();
  } else {
    openPlayer(option.id);
  }
  eventBus.$emit('audio-handler', { url: audioURL.value, id: currentFileId.value});
};

onMounted(() => eventBus.$on('close-player', closePlayer));

onUnmounted(() => eventBus.$off('close-player', closePlayer));

</script>
<style lang="scss" scoped>
.call-task-timeline-action-play-recording__option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
