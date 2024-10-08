<template>
  <section class="config-nav">
    <navigation-menu :navItems="navItems"/>
  </section>
</template>

<script setup>
  import CrmConfigurationSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmConfigurationSections.enum';
  import { useI18n } from 'vue-i18n';
  import NavigationMenu from '@webitel/ui-sdk/src/modules/NavigationMenu/components/navigation-menu.vue';

  const { t } = useI18n();

  const navItems = [{
    value: CrmConfigurationSections.LOOKUPS,
    name: t('configuration.lookups'),
    subNav: [
      {
        value: CrmConfigurationSections.SOURCES,
        name: t('configuration.sources'),
        route: "sources",
      }
    ],
  }]
</script>

<style lang="scss" scoped>
  .config-nav {
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: center;
    height: 100%;

    --button-min-height: 60px;
    --wrapper-width: 60%;
    --wrapper-height: calc(
      var(--spacing-sm) * 2
      + var(--button-min-height) * 7
      + var(--spacing-2xs) * 6
    );

    --lvl-1-bg: var(--dp-18-surface-color);
    --lvl-1-bg--hover: var(--dp-20-surface-color);
    --lvl-1-bg--selected: var(--primary-color);
    --lvl-1-text--selected: var(--primary-on-color);
  }
</style>
