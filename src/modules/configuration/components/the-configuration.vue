<template>
  <wt-page-wrapper
    class="configuration-page"
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        :secondary-action="close"
        hide-primary
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>

    <template #main>
      <wt-navigation-menu
        :nav="nav"
        :icons="icons"
      />
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { computed, reactive } from 'vue';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import lookupsIcon from '../../../app/assets/icons/sprite/crm-lookups.svg';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';

const { t } = useI18n();

const icons = [lookupsIcon];

const nav = reactive([
  {
    value: 'lookups',
    name: computed(() => t('lookups.lookups')),
    subNav: [
      {
        value: CrmSections.SOURCES,
        name: computed(() => t('lookups.sources.sources', 2)),
        route: 'lookups/sources',
      },
      {
        value: CrmSections.SLAS,
        name: computed(() => t('lookups.slas.slas', 2)),
        route: 'lookups/slas',
      },
      {
        value: CrmSections.CONTACT_GROUPS,
        name: computed(() => t('lookups.contactGroups.contactGroups', 2)),
        route: 'lookups/contact-groups',
      },
      {
        value: CrmSections.PRIORITIES,
        name: computed(() => t('vocabulary.priority', 2)),
        route: 'lookups/priorities',
      },
      {
        value: CrmSections.CLOSE_REASON_GROUPS,
        name: computed(() => t('lookups.closeReasonGroups.closeReasonGroups', 2)),
        route: 'lookups/close-reason-groups',
      },
      {
        value: CrmSections.SERVICE_CATALOGS,
        name: t('lookups.serviceCatalogs.serviceCatalogs', 2),
        route: 'lookups/service-catalogs',
      },
    ],
  },
]);

const path = computed(() => [
  { name: t('crm'), route: '/start-page' },
  { name: t('startPage.configuration.name') },
]);

const { close } = useClose('the-start-page');
</script>

<style lang="scss" scoped>
.configuration-page {
  width: 100%;
  height: 100%;
}

.wt-page-wrapper :deep(.wt-page-wrapper__main) {
  background: transparent;
}
</style>
