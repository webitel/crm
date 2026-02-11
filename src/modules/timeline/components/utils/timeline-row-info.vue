<template>
  <div class="timeline-row-info">
    <p class="timeline-row-info-title typo-subtitle-2">
      <slot
        name="title"
        v-bind="timesScope"
      >
        {{ timestamp }}
      </slot>
    </p>

    <p class="timeline-row-info-subtitle typo-subtitle-2">
      <slot
        name="subtitle"
        v-bind="timesScope"
      >
        {{ timestamp }}
      </slot>
    </p>
  </div>
</template>

<script setup>
import { FormatDateMode } from '@webitel/ui-sdk/enums';
import { formatDate } from '@webitel/ui-sdk/utils';
import capitalize from 'lodash/capitalize';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	timestamp: {
		type: [
			Number,
			String,
		],
		default: 0,
	},
});

const { d, locale } = useI18n();

const timestampTime = computed(() => {
	return formatDate(+props.timestamp, FormatDateMode.TIME);
});

const timestampWeekDay = computed(() => {
	const date = new Date(+props.timestamp);
	return capitalize(d(date, 'timelineWeekday'));
});

const timestampMonth = computed(() => {
	const date = new Date(+props.timestamp);
	return capitalize(d(date, 'timelineMonth'));
});

const timesScope = computed(() => {
	return {
		timestamp: props.timestamp,
		time: timestampTime.value,
		weekDay: timestampWeekDay.value,
		month: timestampMonth.value,
	};
});
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

</style>
