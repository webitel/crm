<template>
  <main class="object-wrap">
    <section class="object">
      <wt-app-header v-if="!shouldHideHeader">
        <wt-notifications-bar />
        <wt-navigation-bar
          :current-app="currentApp"
          :nav="accessibleNav"
          :dark-mode="darkMode"
          :logo-route="StartPageRoutePaths.TheStartPage"
        />
        <wt-logo
          :dark-mode="darkMode"
          :logo-href="startPageHref"
        />
        <wt-dark-mode-switcher />
        <wt-app-navigator
          :apps="apps"
          :current-app="currentApp"
          :dark-mode="darkMode"
        />
        <wt-header-actions
          :build-info="{ release, build, timestamp }"
          :user="userinfo"
          @logout="logoutUser"
          @settings="settings"
        />
      </wt-app-header>
      <div class="object-content-wrap">
        <router-view />
      </div>
    </section>
  </main>
</template>

<script setup>
import { WtNavigationBar } from '@webitel/ui-sdk/components';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';
import WtDarkModeSwitcher from '@webitel/ui-sdk/src/modules/Appearance/components/wt-dark-mode-switcher.vue';
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { storeToRefs } from 'pinia';

import StartPageRoutePaths from '../../modules/start-page/router/internals/start-page-route-paths';
import { useNavStore } from '../../modules/start-page/stores/navStore';

const route = useRoute()
const release = process.env.npm_package_version;
const build = import.meta.env.VITE_BUILD_NUMBER;
const timestamp = import.meta.env.VITE_BUILD_TIMESTAMP;

const store = useStore();
const navStore = useNavStore();

const userinfo = computed(() => store.state.userinfo);
const currentApp = userinfo.value.thisApp;

const checkAccess = computed(() => store.getters['userinfo/CHECK_APP_ACCESS']);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);
const shouldHideHeader = computed(() => !!route.meta.hideHeader);

const { t } = useI18n();

const startPageHref = computed(() => import.meta.env.VITE_START_PAGE_URL);

// Initialize nav, if not initialized yet
navStore.initializeNav();

const { nav } = storeToRefs(navStore);

const accessibleNav = computed(() => nav.value.filter(({ disabled }) => !disabled));

const apps = computed(() => {
  const agent = {
    name: WebitelApplications.AGENT,
    href: import.meta.env.VITE_AGENT_URL,
  };
  const supervisor = {
    name: WebitelApplications.SUPERVISOR,
    href: import.meta.env.VITE_SUPERVISOR_URL,
  };
  const history = {
    name: WebitelApplications.HISTORY,
    href: import.meta.env.VITE_HISTORY_URL,
  };
  const audit = {
    name: WebitelApplications.AUDIT,
    href: import.meta.env.VITE_AUDIT_URL,
  };
  const admin = {
    name: WebitelApplications.ADMIN,
    href: import.meta.env.VITE_ADMIN_URL,
  };
  const grafana = {
    name: WebitelApplications.ANALYTICS,
    href: import.meta.env.VITE_GRAFANA_URL,
  };
  const crm = {
    name: WebitelApplications.CRM,
    href: import.meta.env.VITE_CRM_URL,
  };

  const config = inject('$config');

  const allApps = [admin, supervisor, agent, history, audit, crm];
  if (config?.ON_SITE) allApps.push(grafana);
  return allApps.filter(({ name }) => checkAccess.value(name));
});

function settings() {
  const settingsUrl = import.meta.env.VITE_SETTINGS_URL;
  window.open(settingsUrl);
}

function logout() {
  return store.dispatch('userinfo/LOGOUT');
}

async function logoutUser() {
  return logout();
}
</script>

<style lang="scss" scoped>
.object-wrap {
  display: flex;
  width: 100%;
  height: 100%;
}

.object {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.object-content-wrap {
  flex: 1;
  min-height: 0;
}

.wt-dark-mode-switcher {
  margin-right: auto;
}
</style>
