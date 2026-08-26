<template>
  <wt-context-menu
    :options="contextOptions"
    class="timeline-action-menu"
    @click="handleOptionSelect"
  >
    <template #activator="{ toggle }">
      <wt-icon-btn
        icon="options"
        @click="toggle"
      />
    </template>

    <template #option="{ text, icon }">
      <div class="timeline-action-menu__option">
        <wt-icon :icon="icon" />
        {{ text }}
      </div>
    </template>
  </wt-context-menu>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});

const { t } = useI18n();

function showInfo() {}

function openInHistory() {
	window.open(`${import.meta.env.VITE_HISTORY_URL}/${props.id}`, '_blank');
}

const contextOptions = computed(() => [
	{
		id: 'showInfo',
		text: t('timeline.actions.showInfo'),
		icon: 'rounded-info',
		handler: showInfo,
	},
	{
		id: 'openInHistory',
		text: t('reusable.openInHistory'),
		icon: 'history',
		handler: openInHistory,
	},
]);

function handleOptionSelect({ option }) {
	option.handler();
}
</script>

<style scoped>
.timeline-action-menu__option {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--spacing-xs);
}
</style>
