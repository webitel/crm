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
          :icon="id === currentlyPlaying ? 'stop' : 'play'"
        />
        {{ text }}
      </div>
    </template>
  </wt-context-menu>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted } from 'vue';
import { usePlayMedia } from '../../../../../../../../../app/composables/usePlayMedia.js';

const namespace = inject('namespace');
const eventBus = inject('$eventBus');

const props = defineProps({
  files: {
    type: Array,
    required: true,
  },
});

const {
  audioURL,
  currentlyPlaying,
  play,
  closePlayer,
} = usePlayMedia();

const isAnyFilesPlaying = computed(() => {
  return props.files.some((file) => file.id === currentlyPlaying.value);
});

const contextOptions = computed(() => {
  return props.files.map(({ name, id }) => ({ text: name, id }));
});

const handleOptionSelect = ({ option }) => {
  if (currentlyPlaying.value === option.id) {
    closePlayer();
  } else {
    play(option.id);
    if(audioURL.value) eventBus.$emit('play-audio', audioURL.value);
  }
};

onMounted(() => {
  eventBus.$on('close-player', closePlayer);
});


onUnmounted(() => {
  eventBus.$off('close-player', closePlayer);
});

</script>
<style lang="scss" scoped>
.call-task-timeline-action-play-recording__option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
