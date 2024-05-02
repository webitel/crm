<template>
  <wt-indicator
    :color=statusColor
    :text="t(`contacts.timeline.status.${ status }`)"
    size="sm"
  />
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import TimelineTaskStatus from '../../enums/TimelineTaskStatus.enum.js';

const props = defineProps({
  status: {
    type: String,
    default: TimelineTaskStatus.STARTED,
    validator: (value) => Object.values(TimelineTaskStatus).includes(value),
  },
});

const { t } = useI18n();

const statusColor = computed(() => {
  switch (props.status) {
    case TimelineTaskStatus.STARTED:
      return 'success';
    case TimelineTaskStatus.TRANSFERRED:
      return 'transfer';
    default:
      return 'error';
  }
});
</script>

<style lang="scss" scoped>

</style>
