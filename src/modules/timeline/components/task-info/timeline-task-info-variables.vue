<template>
  <wt-table
    :data="variables"
    :headers="headers"
    :selectable="false"
    :grid-actions="false"
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
