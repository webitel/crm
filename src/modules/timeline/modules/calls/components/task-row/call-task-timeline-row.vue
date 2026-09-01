<template>
  <timeline-row class="call-task-timeline-row">
    <template #before-content>
      <timeline-row-info
        :timestamp="createdAt"
      >
        <template #title="{ time }">
          {{ time }}
        </template>

        <template #subtitle>
          <timeline-task-status :status="taskStatus" />
        </template>
      </timeline-row-info>
    </template>

    <template #pin="{ toggle, collapsed }">
      <timeline-pin
        :collapsed="collapsed"
        :last="last && collapsed"
        :non-clickable="!detailed"
        :type="pinType"
        @click="toggle"
      />
    </template>

    <template #content>
        <task-timeline-row-content-wrapper>
          <div class="call-task-timeline-row-content-wrapper">
            <div class="call-task-timeline-row-info">
              <timeline-row-initiator
                :text="initiator.name"
                :type="initiatorType"
              />

              <wt-display-chip-items v-if="hiddenParticipants.length" :items="hiddenParticipants" hide-first-item>
                <template #items>
                  <timeline-row-initiator
                    v-for="({ id, name }) of hiddenParticipants"
                    :key="id"
                    :text="name"
                  />
                </template>
              </wt-display-chip-items>

              <timeline-row-duration
                :duration="duration"
              />

              <timeline-row-duration
                v-if="totalDuration"
                is-total-duration
                :duration="totalDuration"
              />
            </div>

            <call-task-timeline-actions
              :task="task"
            />
          </div>

            <wt-player
              v-if="showAudioPlayer"
              :src="{
                src: mediaSource.url,
                type: mediaSource.file?.mimeType,
              }"
              position="relative"
              @close="closePlayer"
            />

          <wt-vidstack-player
            v-if="showVideoPlayer"
            :title="mediaSource.file?.name"
            :src="mediaSource.url"
            :mime="mediaSource.file?.mimeType"
            :size="ComponentSize.MD"
            closable
            @close="closePlayer"
          />
        </task-timeline-row-content-wrapper>

    </template>

    <template #dropdown>
      <call-points-timeline-row-section
        :last="last"
        :task-id="taskId"
      />
    </template>
  </timeline-row>
</template>

<script lang="ts" setup>
import { EngineCallFile } from '@webitel/api-services/gen/models';
import {
	WtDisplayChipItems,
	WtPlayer,
	WtVidstackPlayer,
} from '@webitel/ui-sdk/components';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import type { eventBus as EventBus } from '@webitel/ui-sdk/scripts';
import {
	assumeVidstackSupportedAudioType,
	assumeVidstackSupportedVideoType,
} from '@webitel/ui-sdk/src/components/wt-vidstack-player/utils/normalizeVidstackMediaSrc';
import {
	computed,
	inject,
	onMounted,
	onUnmounted,
	provide,
	reactive,
	toRefs,
} from 'vue';

import TaskTimelineRowContentWrapper from '../../../../components/task-row/task-timeline-row-content-wrapper.vue';
import TimelinePin from '../../../../components/utils/timeline-pin.vue';
import TimelineRow from '../../../../components/utils/timeline-row.vue';
import TimelineRowDuration from '../../../../components/utils/timeline-row-duration.vue';
import TimelineRowInfo from '../../../../components/utils/timeline-row-info.vue';
import TimelineRowInitiator from '../../../../components/utils/timeline-row-initiator.vue';
import TimelineTaskStatus from '../../../../components/utils/timeline-task-status.vue';
import { TimelineInitiatorType } from '../../../../enums/TimelineInitiatorType.enum';
import { TimelinePinType } from '../../../../enums/TimelinePinType.enum';
import { TimelineTaskKind } from '../../../../enums/TimelineTaskKind.enum';
import { TimelineTaskStatus as TimelineTaskStatusEnum } from '../../../../enums/TimelineTaskStatus.enum';
import CallPointsTimelineRowSection from '../point-row/call-points-timeline-row-section.vue';
import CallTaskTimelineActions from './actions/call-task-timeline-actions.vue';

const props = defineProps({
	task: {
		type: Object,
		required: true,
	},
	detailed: {
		type: Boolean,
		default: false,
	},
	last: {
		type: Boolean,
		default: false,
	},
});

const mediaSource = reactive<{
	url: string;
	file: EngineCallFile;
}>({
	url: null,
	file: null,
});
const eventBus = inject<typeof EventBus>('$eventBus');

provide(
	'audioId',
	computed(() => mediaSource.file?.id),
);

const {
	createdAt,
	participants,
	isInbound,
	isMissed,
	duration,
	totalDuration,
	flowScheme,
	queue,
	id: taskId,
} = toRefs(props.task);

const taskType = computed(() => {
	if (isMissed?.value) return TimelineTaskKind.CallMissed;
	if (isInbound?.value) return TimelineTaskKind.CallInbound;
	return TimelineTaskKind.CallOutbound;
});

const pinType = computed(() => {
	switch (taskType.value) {
		case TimelineTaskKind.CallMissed:
			return TimelinePinType.CallMissed;
		case TimelineTaskKind.CallInbound:
			return TimelinePinType.CallInbound;
		case TimelineTaskKind.CallOutbound:
			return TimelinePinType.CallOutbound;
		default:
			throw new Error('Unknown task type for pin');
	}
});

const taskStatus = computed(() => {
	if (taskType.value === TimelineTaskKind.CallMissed)
		return TimelineTaskStatusEnum.Missed;
	return TimelineTaskStatusEnum.Started;
});

const initiatorType = computed(() => {
	if (!isInbound?.value) return TimelineInitiatorType.Contact; // agent
	if (participants?.value) return TimelineInitiatorType.Contact;
	if (queue?.value) return TimelineInitiatorType.Bot;
	if (flowScheme?.value) return TimelineInitiatorType.Flow;
	return TimelineInitiatorType.Contact;
});

const initiator = computed(() => {
	switch (initiatorType.value) {
		case TimelineInitiatorType.Flow:
			return flowScheme?.value;
		case TimelineInitiatorType.Bot:
			return queue?.value;
		default:
			return participants?.value.at(0);
	}
});

const hiddenParticipants = computed(() =>
	(participants?.value || []).filter(({ id }) => id !== initiator.value.id),
);

function closePlayer() {
	eventBus.$emit('close-player');
	mediaSource.url = '';
	mediaSource.file = null;
}

onMounted(() => {
	eventBus.$on('media-source-handler', ({ url, file }) => {
		if (!url || !file) return closePlayer();
		mediaSource.url = url;
		mediaSource.file = file;
	});
});

onUnmounted(() => {
	eventBus.$off('media-source-handler');
});

const currentFile = computed(() =>
	props.task.files?.find((file) => file.id === mediaSource.file?.id),
);

const showAudioPlayer = computed(
	() =>
		currentFile.value &&
		assumeVidstackSupportedAudioType({
			src: mediaSource.url,
			type: currentFile.value.mimeType,
		}),
);

const showVideoPlayer = computed(
	() =>
		currentFile.value &&
		assumeVidstackSupportedVideoType({
			src: mediaSource.url,
			type: currentFile.value.mimeType,
		}),
);
</script>

<style scoped>
.call-task-timeline-row-content-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.call-task-timeline-row-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
}

.task-timeline-row-content-wrapper {
  flex-direction: column;
  align-items: stretch;
}
</style>

