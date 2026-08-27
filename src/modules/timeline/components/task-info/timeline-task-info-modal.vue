<template>
  <wt-popup
    :shown="shown"
    class="timeline-task-info-modal"
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
      </div>
    </template>
  </wt-popup>
</template>

<script setup>
import { computed, inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import TimelineAPI from '../../api/TimelineAPI';
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
		text: t('vocabulary.variables', 2),
		value: 'variables',
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
.timeline-task-info-modal__content {
  margin-top: var(--spacing-sm);
}
</style>
