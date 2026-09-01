<template>
  <wt-popup
    :shown="shown"
    class="timeline-task-info-popup wt-scrollbar"
    @close="closePopup"
  >
    <template #title>
      {{ t('timeline.info.title') }}
    </template>
    <template #main>
      <wt-tabs
        :current="currentTab"
        :tabs="tabs"
        @change="changeTab"
      />

      <wt-loader v-if="isLoading" />

      <div v-else class="timeline-task-info-popup__content">
        <component
          :is="tabComponents[currentTab.value]"
          v-bind="tabProps"
          @empty-list="handleEmptyList"
        />
      </div>
    </template>

    <template #actions>
      <wt-button
        color="secondary"
        @click="closePopup"
      >
        {{ t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import { TimelineAPI } from '@webitel/api-services/api';
import type { ContactsGetTimelineItemInfoResponse } from '@webitel/api-services/gen/models';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type { TimelineTab, TimelineTask } from '../../types/timeline.types';
import TimelineTaskInfoPostprocessing from './timeline-task-info-postprocessing.vue';
import TimelineTaskInfoTranscription from './timeline-task-info-transcription.vue';
import TimelineTaskInfoVariables from './timeline-task-info-variables.vue';

const props = withDefaults(
	defineProps<{
		shown?: boolean;
		task: TimelineTask;
		parentId: string;
	}>(),
	{
		shown: false,
	},
);

const emit = defineEmits<{
	'update:shown': [
		shown: boolean,
	];
}>();

const { t } = useI18n();

const tabs = computed<TimelineTab[]>(() => [
	{
		text: t('timeline.info.title', 2),
		value: 'variables',
	},
	{
		text: t('timeline.info.postprocessing'),
		value: 'postprocessing',
	},
	...(props.task.transcripts?.length
		? [
				{
					text: t('timeline.actions.transcription'),
					value: 'transcription',
				},
			]
		: []),
]);

const currentTab = ref<TimelineTab>(tabs.value[0]);

function changeTab(tab: TimelineTab) {
	currentTab.value = tab;
}

function closePopup() {
	currentTab.value = tabs.value[0];
	emit('update:shown', false);
}

function handleEmptyList() {
	currentTab.value = tabs.value[0];
}

const tabComponents = {
	variables: TimelineTaskInfoVariables,
	postprocessing: TimelineTaskInfoPostprocessing,
	transcription: TimelineTaskInfoTranscription,
};

const tabProps = computed<Record<string, unknown>>(() => {
	switch (currentTab.value.value) {
		case 'variables':
			return {
				variables: info.value?.variables,
			};
		case 'postprocessing':
			return {
				postprocessing: info.value?.postprocessing,
			};
		case 'transcription':
			return {
				task: props.task,
			};
		default:
			return {};
	}
});

const info = ref<ContactsGetTimelineItemInfoResponse | null>(null);
const isLoading = ref(false);

async function loadInfo() {
	isLoading.value = true;
	try {
		info.value = await TimelineAPI.getInfo({
			parentId: props.parentId,
			type: props.task.type,
			id: props.task.id,
		});
	} finally {
		isLoading.value = false;
	}
}

watch(
	() => props.shown,
	(shown) => {
		if (shown) loadInfo();
	},
);
</script>

<style scoped>
.timeline-task-info-popup :deep(.wt-popup__popup) {
  height: 600px;
}

.timeline-task-info-popup :deep(.wt-popup__main) {
  display: flex;
  flex-direction: column;
}

.timeline-task-info-popup__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: var(--spacing-xs);
  min-height: 0;
}
</style>
