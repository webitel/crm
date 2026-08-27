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
      <div class="timeline-task-info-modal__content" />
    </template>
  </wt-popup>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

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
</script>
