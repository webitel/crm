<template>
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

    <template #option="option">
      <p>{{ option.text }}</p>
    </template>
  </wt-context-menu>
</template>
<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  id: {
    type: String,
  }
})

const { t } = useI18n();
const historyLink = `${import.meta.env.VITE_HISTORY_URL}/${props.id}`;

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
