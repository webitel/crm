<template>
  <wt-popup
    :shown="shown"
    class="timeline-task-info-modal wt-scrollbar"
    @close="emit('update:shown', false)"
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

      <div v-else class="timeline-task-info-modal__content">
        <timeline-task-info-variables
          v-if="currentTab.value === 'variables'"
          :variables="info?.variables"
        />
        <timeline-task-info-postprocessing
          v-if="currentTab.value === 'postprocessing'"
          :postprocessing="info?.postprocessing"
        />
      </div>
    </template>

    <template #actions>
      <wt-button
        color="secondary"
        @click="emit('update:shown', false)"
      >
        {{ t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import TimelineAPI from '../../api/TimelineAPI';
import TimelineTaskInfoPostprocessing from './timeline-task-info-postprocessing.vue';
import TimelineTaskInfoVariables from './timeline-task-info-variables.vue';

const props = defineProps({
	shown: {
		type: Boolean,
		default: false,
	},
	task: {
		type: Object,
		required: true,
	},
	parentId: {
		type: String,
		required: true,
	},
});

const emit = defineEmits([
	'update:shown',
]);

const { t } = useI18n();

const tabs = computed(() => [
	{
		text: t('timeline.info.title', 2),
		value: 'variables',
	},
	{
		text: t('timeline.info.postprocessing'),
		value: 'postprocessing',
	},
]);

const currentTab = ref(tabs.value[0]);

function changeTab(tab) {
	currentTab.value = tab;
}

const mode = inject('mode');

const info = ref(null);
const isLoading = ref(false);

async function loadInfo() {
	isLoading.value = true;
	try {
		info.value = await TimelineAPI.getInfo({
			mode,
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
.timeline-task-info-modal :deep(.wt-popup__popup) {
  height: 600px;
}

.timeline-task-info-modal :deep(.wt-popup__main) {
  display: flex;
  flex-direction: column;
}

.timeline-task-info-modal__content {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: var(--spacing-xs);
  min-height: 0;
}
</style>
