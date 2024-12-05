<template>
  <article class="opened-case-general">
    <case-service
      :edit-mode="editMode"
      :namespace="namespace"
    />
  </article>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue';
import { useStore } from 'vuex';
import CaseService from '../modules/service/components/case-service.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();

</script>
