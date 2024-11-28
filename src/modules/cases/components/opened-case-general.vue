<template>
  <article class="opened-case-general">
    <case-service />
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import CaseService from '../modules/case-service/components/case-service.vue';

const { t } = useI18n();

const editMode = computed(() => route.query.edit === 'true');

</script>


<style lang="scss" scoped>

</style>
