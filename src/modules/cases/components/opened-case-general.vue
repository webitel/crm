<template>
  <article class="opened-case-general">
    <case-service
      :edit-mode="editMode"
      :namespace="namespace"
    />
  </article>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import CaseService from '../modules/service/components/case-service.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  editMode: {
    type: Boolean,
    default: false,
  }
});

const { t } = useI18n();

const route = useRoute();

</script>


<style lang="scss" scoped>

</style>
