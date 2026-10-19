<template>
  <wt-icon-btn
    v-tooltip="
      t(newestFirst ? 'timeline.chats.newestFirst' : 'timeline.chats.oldestFirst')
    "
    :icon="newestFirst ? 'sort-desc' : 'sort-asc'"
    @click="toggleSort(taskId)"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useChatTimelineSort } from '../../composables/useChatTimelineSort';

const props = defineProps({
	taskId: {
		type: [
			String,
			Number,
		],
		required: true,
	},
});

const { t } = useI18n();
const { isNewestFirst, toggleSort } = useChatTimelineSort();
const newestFirst = computed(() => isNewestFirst(props.taskId));
</script>
