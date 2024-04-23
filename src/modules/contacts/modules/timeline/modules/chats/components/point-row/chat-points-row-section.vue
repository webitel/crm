<template>
  <div class="chat-points-row-section">
    <ChatPointRow
      v-for="(point) of points"
      :key="point.id"
      :point="point"
    />
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useStore } from 'vuex';
import ChatPointRow from './chat-point-row.vue';

const props = defineProps({
  chatId: {
    type: String,
    required: true,
  },
});

const timelineNamespace = inject('namespace');

const namespace = `${timelineNamespace}/chats`;

const store = useStore();

const points = computed(() => {
  return store.getters[`${namespace}/HISTORY_BY_CHAT_ID`](props.chatId);
});

function loadHistory() {
  store.dispatch(`${namespace}/LOAD_HISTORY`, { chatId: props.chatId });
}

if (!points.value) {
  loadHistory();
}

</script>

<style lang="scss" scoped>

</style>
