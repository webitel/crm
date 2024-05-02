<template>
  <div class="call-task-timeline-actions">
    <wt-context-menu
      :options="options"
      @click="$event.option.handler()"
    >
      <template #activator>
        <wt-tooltip>
          <template #activator>
            <wt-icon-btn
              icon="options"
            />
          </template>
          {{ t('vocabulary.options', 2) }}
        </wt-tooltip>
      </template>

      <template #option="{ text }">
        <p>{{ text }}</p>
      </template>
    </wt-context-menu>
  </div>

</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const { t } = useI18n();
const historyLink = `${import.meta.env.VITE_HISTORY_URL}/${props.task.id}`;

const options = computed(() => {
  const openHistory = {
    text: t('contacts.timeline.actions.openInHistory'),
    handler: () => window.open(historyLink),
  };
  return [
    openHistory,
  ];
});
</script>

<style lang="scss" scoped>
.call-task-timeline-actions {
  display: flex;
  align-items: center;
}
</style>
