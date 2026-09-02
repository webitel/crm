<template>
  <wt-context-menu
    :options="timelineActionOptions"
    class="timeline-action-menu"
    @click="handleOptionSelect"
  >
    <template #activator="{ toggle }">
      <wt-icon-btn
        icon="options"
        @click="toggle"
      />
    </template>

    <template #option="{ text, icon }">
      <div class="timeline-action-menu__option">
        <wt-icon :icon="icon" />
        {{ text }}
      </div>
    </template>
  </wt-context-menu>

  <timeline-task-info-popup
    v-model:shown="showInfoPopup"
    :task="task"
    :parent-id="parentId"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { TimelineEventType } from '../../enums/TimelineEventType';
import { useTimelineStore } from '../../stores/timeline';
import type {
	TimelineActionOption,
	TimelineTask,
} from '../../types/timeline.types';
import TimelineTaskInfoPopup from '../task-info/timeline-task-info-popup.vue';

const props = defineProps<{
	task: TimelineTask;
}>();

const { t } = useI18n();

const timelineStore = useTimelineStore();

const { parentId } = storeToRefs(timelineStore);

const showInfoPopup = ref(false);

function showInfo() {
	showInfoPopup.value = true;
}

function openInHistory() {
	window.open(`${import.meta.env.VITE_HISTORY_URL}/${props.task.id}`, '_blank');
}

const timelineActionOptions = computed<TimelineActionOption[]>(() => [
	{
		id: 'showInfo',
		text: t('timeline.actions.showInfo'),
		icon: 'call-info',
		handler: showInfo,
	},
	...(props.task.type === TimelineEventType.Call
		? [
				{
					id: 'openInHistory',
					text: t('reusable.openInHistory'),
					icon: 'history',
					handler: openInHistory,
				},
			]
		: []),
]);

function handleOptionSelect({ option }: { option: TimelineActionOption }) {
	option.handler();
}
</script>

<style scoped>
.timeline-action-menu__option {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
