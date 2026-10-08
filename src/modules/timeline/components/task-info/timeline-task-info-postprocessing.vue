<template>
  <wt-empty
    v-if="showEmpty"
    :image="emptyImage"
    :text="emptyText"
  />
  <wt-table
    v-else
    class="timeline-task-info-postprocessing wt-scrollbar"
    :data="rows"
    :headers="headers"
    :selectable="false"
    :grid-actions="false"
  >
    <template #key="{ item }">
      <div class="timeline-task-info-postprocessing__label">
        <wt-icon
          v-if="item.isAgent"
          icon="agent"
        />
        <p class="typo-body-1-bold">{{ item.label }}:</p>
      </div>
    </template>
    <template #value="{ item }">
      <p class="timeline-task-info-postprocessing__value typo-body-1">{{ item.value }}</p>
    </template>
  </wt-table>
</template>

<script setup lang="ts">
import type { ContactsTimelinePostprocessingResult } from '@webitel/api-services/gen/models';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty';
import upperFirst from 'lodash/upperFirst';
import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
	defineProps<{
		postprocessing?: ContactsTimelinePostprocessingResult[];
	}>(),
	{
		postprocessing: () => [],
	},
);

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

const rows = computed(() =>
	props.postprocessing.flatMap((entry) => [
		{
			isAgent: true,
			label: entry.agent?.name,
		},
		...entryFields(entry.form).map(([key, value]) => ({
			label: upperFirst(key),
			value: formatValue(value),
		})),
	]),
);

const {
	showEmpty,
	image: emptyImage,
	text: emptyText,
} = useTableEmpty({
	dataList: toRef(props.postprocessing),
});

function entryFields(form: unknown) {
	if (typeof form !== 'object' || form === null) return [];
	return Object.entries(form).filter(([key]) => key !== 'agent');
}

function formatValue(value: unknown) {
	return JSON.stringify(value).replace(/^"|"$/g, '');
}
</script>

<style scoped>
.timeline-task-info-postprocessing {
  flex: 1;
  min-height: 0;
}

.timeline-task-info-postprocessing__label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  overflow-wrap: anywhere;
}

.timeline-task-info-postprocessing__value {
  min-width: 0;
  overflow-wrap: anywhere;
}
</style>
