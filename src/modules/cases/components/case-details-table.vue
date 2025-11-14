<template>
  <div class="case-details-table">
    <wt-table
      :data="details"
      :headers="headers"
      :selectable="false"
      :grid-actions="false"

    >
      <template #description="{ item: rowItem }">
        {{ rowItem.description }}
      </template>
      <template #comments="{ item: rowItem }">
        {{ rowItem.text }}
      </template>
      <template #author="{ item: rowItem }">
        {{ rowItem.author }}
      </template>
      <template #createdAt="{ item: rowItem }">
        {{ prettifyDate(rowItem.createdAt) }}
      </template>
    </wt-table>
  </div>
</template>

<script setup>
import { WtTable } from '@webitel/ui-sdk/components';
import { computed } from 'vue';

import prettifyDate from '../utils/prettifyDate';

const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
});

const headers = [
  { value: 'description', locale: 'vocabulary.description'},
  { value: 'comments', locale: 'cases.comments.comments'},
  { value: 'author', locale: 'cases.author' },
  { value: 'createdAt', locale: 'reusable.createdAt'},
];

const details = computed(() => {
  let items = [];

  const commentItems = props.item?.comments?.items || [];
  if (commentItems.length) {
    items = commentItems.map(comment => ({
      text: comment.text || '',
      createdAt: comment.createdAt || '',
      author: comment.createdBy?.name || '',
    }));
  }

  if (props.item?.description) {
    if (items.length) {
      items[0].description = props.item.description;
    } else {
      items.push({ description: props.item.description });
    }
  }

  return items;
});

</script>

<style lang="scss" scoped>
// 100vw - Main table has horizontal scroll. It is necessary to have casesDetailsTable displayed only width of viewport.
// Main table has fixed actions. Their width is 72 px and they includes width of viewport. So, they need to be excluded.
// 72 pixels exclude 2 times, because on layout, casesDetailsTable width should not be larger than markup of the fixed actions
.case-details-table :deep(.p-datatable) {
  max-width: calc(100vw - (72px * 2));
}
</style>
