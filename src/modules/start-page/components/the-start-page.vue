<template>
  <div>
    <start-page :nav="nav"/>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useStore } from 'vuex';
  import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
  import StartPage from '@webitel/ui-sdk/src/modules/StartPage/components/the-start-page.vue';

  const { t } = useI18n();

  const nav = [
    {
      value: CrmSections.CONTACTS,
      route: '/contacts',
      class: 'cc_contacts',
    },
    {
      value: CrmSections.CONFIGURATION,
      route: '/configuration',
      class: 'cc_configuration',
      name: 'configuration',
    },
  ]
</script>

<style scoped>
</style>
