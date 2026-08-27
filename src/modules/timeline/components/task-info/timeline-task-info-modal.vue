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

      <div class="timeline-task-info-modal__content">
        <timeline-task-info-variables
          v-if="currentTab.value === 'variables'"
          :task="task"
        />
      </div>
    </template>
  </wt-popup>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import TimelineTaskInfoVariables from './timeline-task-info-variables.vue';

defineProps({
	shown: {
		type: Boolean,
		default: false,
	},
	task: {
		type: Object,
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
</script>

<style scoped>
.timeline-task-info-modal__content {
  margin-top: var(--spacing-sm);
}
</style>
