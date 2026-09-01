<template>
  <wt-empty
    v-if="showEmpty"
    :image="emptyImage"
    :text="emptyText"
  />
  <wt-table
    v-else
    class="timeline-task-info-variables wt-scrollbar"
    :data="variables"
    :headers="headers"
    :selectable="false"
    :grid-actions="false"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useTableEmpty } from "@webitel/ui-sdk/modules/TableComponentModule/composables/useTableEmpty";

const props = defineProps({
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

const {
  showEmpty,
  image: emptyImage,
  text: emptyText,
} = useTableEmpty({
  dataList: props.variables,
});
</script>

<style scoped>
.timeline-task-info-variables {
  flex: 1;
  min-height: 0;
}
</style>
