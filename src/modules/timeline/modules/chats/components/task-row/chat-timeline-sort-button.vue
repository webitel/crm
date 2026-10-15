<template>
  <wt-icon-btn
    v-tooltip="
      t(newestFirst ? 'timeline.chats.newestFirst' : 'timeline.chats.oldestFirst')
    "
    :icon="newestFirst ? 'sort-desc' : 'sort-asc'"
    @click="toggleSort"
  />
</template>

<script setup>
import { useI18n } from 'vue-i18n';

import { useChatTimelineSort } from '../../composables/useChatTimelineSort';

const { t } = useI18n();
const { newestFirst, toggleSort } = useChatTimelineSort();
</script>
