<template>
  <wt-table
    :data="variables"
    :headers="headers"
    :selectable="false"
    :grid-actions="false"
  />
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps({
	task: {
		type: Object,
		required: true,
	},
});

const { t } = useI18n();

const variables = ref([]);

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
