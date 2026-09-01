<template>
  <wt-empty
    v-if="showEmpty"
    :image="emptyImage"
    :text="emptyText"
  />
  <div
    v-else
    class="timeline-task-info-postprocessing wt-scrollbar"
  >
    <div
      v-for="(entry, index) in postprocessing"
      :key="index"
      class="timeline-task-info-postprocessing__agent"
    >
      <div class="timeline-task-info-postprocessing__agent-name typo-subtitle-1">
        <wt-icon icon="agent" />
        {{ entry.agent?.name }}
      </div>
      <div
        class="timeline-task-info-postprocessing__changes"
      >
        <template
          v-for="([key, value], index) in entryFields(entry.form)"
          :key="key"
        >
          <wt-divider v-if="index" />
          <div class="timeline-task-info-postprocessing__field">
            <p class="typo-subtitle-1">{{ key }}:</p>
            <p class="typo-body-1">{{ formatValue(value) }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTableEmpty } from "@webitel/ui-sdk/modules/TableComponentModule/composables/useTableEmpty";

const props = defineProps({
	postprocessing: {
		type: Array,
		default: () => [],
	},
});

const { t } = useI18n();

const {
  showEmpty,
  image: emptyImage,
  text: emptyText,
} = useTableEmpty({
  dataList: toRef(props.postprocessing),
});

function entryFields(entry) {
	return Object.entries(entry).filter(([key]) => key !== 'agent');
}

function formatValue(value) {
	return JSON.stringify(value).replace(/^"|"$/g, '');
}
</script>

<style scoped>
.timeline-task-info-postprocessing {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--spacing-sm);
  min-height: 0;
  overflow: auto;
}

.timeline-task-info-postprocessing__agent-name {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.timeline-task-info-postprocessing__changes {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.timeline-task-info-postprocessing__field {
  display: flex;
  gap: var(--spacing-xs);
}
</style>
