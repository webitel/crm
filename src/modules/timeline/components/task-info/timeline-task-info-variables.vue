<template>
  <wt-table
    v-if="variables.length"
    class="timeline-task-info-variables wt-scrollbar"
    :data="variables"
    :headers="headers"
    :selectable="false"
    :grid-actions="false"
  />
  <wt-empty
    v-else
    :text="t('webitelUI.empty.text.empty')"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
	variables: {
		type: Array,
		default: () => [],
	},
});

const { t } = useI18n();

const headers = computed(() => [
	{
		value: 'key',
		text: t('vocabulary.keys'),
	},
	{
		value: 'value',
		text: t('vocabulary.values'),
	},
]);
</script>

<style scoped>
.timeline-task-info-variables {
  flex: 1;
  min-height: 0;
}
</style>
