<template>
  <div class="timeline-task-filter-container">
    <timeline-task-filter
      v-for="(type, idx) of timelineEventTypes"
      :key="idx"
      :type="type"
      :icon="filterIcon[type]"
      :selected="isSelectedFilter(type)"
      :count="taskCount[type]"
      @change="changeFilterValue"
    ></timeline-task-filter>
  </div>

</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import timelineEventTypes from '../../../components/enums/timelineEventTypes.enum.js'; ///прибрати після додавання енуму Егора
import TimelineTaskFilter from './timeline-task-filter.vue';

const props = defineProps({
  list: {
    type: Array,
  },
  activeFilters: {
    type: Array,
  },
  filtersNamespace: {
    type: String,
    required: true,
  },
});

const store = useStore();
const filterIcon = {
  [timelineEventTypes.CALLS]: 'call',
  [timelineEventTypes.CHATS]: 'chat',
};

const taskCount = computed(() => {
  return {
    [timelineEventTypes.CALLS]: culcTotalCalls(),
    [timelineEventTypes.CHATS]: culcTotalChats(),
  }
});

function setFilter(payload) {
  return store.dispatch(`${props.filtersNamespace}/SET_FILTER`, payload);
}

function culcTotalCalls() {
  return props.list?.reduce((acc, item) => acc + Number(item.callsCount), 0) || 0;
}

function culcTotalChats() {
  return props.list?.reduce((acc, item) => acc + Number(item.chatsCount), 0) || 0;
}

function isSelectedFilter(type) {
  return !props.activeFilters ? true : props.activeFilters.includes(type);
}

function defineFilterValue({ type, value }) {
  let result;
  if(!value) {
    if(props.activeFilters) result = props.activeFilters.filter(item => item !== type);
    else {
      result = timelineEventTypes.filter(item => item.type !== type).map(item => item.type);
    }
  } else {
    result = [...props.activeFilters];
    result.push(type);
  }
  return result;
}

function changeFilterValue(event) {
  const value = defineFilterValue(event);
  setFilter({ filter: 'type', value })
}
</script>

<style lang="scss" scoped>
.timeline-task-filter-container {
  display: flex;
  gap: var(--spacing-md);
}
</style>
