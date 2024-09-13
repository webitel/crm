<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
      <wt-page-header
        :hide-primary="!hasSaveActionAccess"
        :primary-action="save"
        :primary-disabled="disabledSave"
        :primary-text="saveText"
        :secondary-action="close"
        :secondary-text="$t('cancel')"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>
    <template #main>
      <form
        class="main-container"
        @submit.prevent="save"
      >
        <wt-tabs
          :current="currentTab"
          :tabs="tabs"
          @change="changeTab"
        />
        <component
          :is="currentTab.value"
          :namespace="namespace"
          :v="v$"
        />
        <input
          hidden
          type="submit"
        > <!--  submit form on Enter  -->
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { minValue, required } from '@vuelidate/validators';
import openedObjectMixin from '../../../../../../../app/mixins/objectPagesMixins/openedObjectMixin/openedObjectMixin';

import General from './opened-contact-groups-general.vue';
import RouteNames from "../../../../../../../app/router/_internals/RouteNames.enum.js";
import ContactGroupsRouteNames from "../router/_internals/ContactGroupsRouteNames.enum.js";

export default {
  name: 'OpenedContactGroups',
  components: {
    General,
  },
  mixins: [openedObjectMixin],
  setup: () => ({
    v$: useVuelidate(),
  }),

  data: () => ({
    namespace: 'cgroups/groups',
    routeName: RouteNames.CONTACT_GROUPS,
    permissionsTabPathName: ContactGroupsRouteNames.PERMISSIONS,
  }),
  validations: {
    itemInstance: {
      name: { required },
    },
  },

  computed: {
    tabs() {
      const tabs = [
        {
          text: this.$t('objects.general'),
          value: 'general',
          pathName: ContactGroupsRouteNames.GENERAL,
        },
      ];

      if (this.id) tabs.push(this.permissionsTab);
      return tabs;
    },

    path() {
      return [
        {
          name: this.$t('crm'),
          route: '/start-page'
        },
        {
          name: this.$t('lookups.contactGroups.configurations'),
          route: '/configuration'
        },
        {
          name: this.$t('lookups.lookups'),
        },
        {
          name: this.id ? this.pathName : this.$t('objects.new'),
          route: {
            name: this.currentTab.pathName,
            query: this.$route.query,
          },
        },
      ];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
