<template>
  <div class="opened-timeline-call">
    <event-record>
      <template v-slot:date>
<!--        <event-status-detail-->
<!--          :time="createdAt"-->
<!--          :status="status"-->
<!--        >-->
<!--        </event-status-detail>-->
      </template>
    </event-record>
  </div>
</template>

<script setup>
import EventRecord from './utils/event-record.vue';
import EventStatusDetail from './utils/event-status-detail.vue';
</script>
<style lang="scss" scoped></style>
