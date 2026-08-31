<template>
  <wt-indicator
		class="timeline-task-status__indicator"
    :color="statusColor"
    :text="t(`timeline.status.${ status }`)"
    size="sm"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { TimelineTaskStatus } from '../../enums/TimelineTaskStatus.enum';

const props = defineProps({
	status: {
		type: String,
		default: TimelineTaskStatus.Started,
		validator: (value: string) =>
			Object.values(TimelineTaskStatus).includes(value as TimelineTaskStatus),
	},
});

const { t } = useI18n();

const statusColor = computed(() => {
	switch (props.status) {
		case TimelineTaskStatus.Started:
			return 'success';
		case TimelineTaskStatus.Sent:
			return 'success';
		case TimelineTaskStatus.Received:
			return 'success';
		case TimelineTaskStatus.Transferred:
			return 'transfer';
		default:
			return 'error';
	}
});
</script>

<style scoped>
.timeline-task-status__indicator {
	word-break: break-all;
}
</style>
