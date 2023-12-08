<template>
  <main class="object-wrap">
    <section class="object">
      <wt-app-header>
        <wt-notifications-bar></wt-notifications-bar>
        <wt-navigation-bar
          :current-app="currentApp"
          :nav="nav"
          :dark-mode="darkMode"
        ></wt-navigation-bar>
        <wt-dark-mode-switcher />
        <wt-app-navigator
          :apps="apps"
          :current-app="currentApp"
          :dark-mode="darkMode"
        ></wt-app-navigator>
        <wt-header-actions
          :build-info="{ release, build }"
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
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import { computed, inject, onMounted } from 'vue';
import WebitelApplications from '@webitel/ui-sdk/src/enums/WebitelApplications/WebitelApplications.enum';
import authAPI from '@webitel/ui-sdk/src/modules/Userinfo/api/auth';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import WtDarkModeSwitcher from '@webitel/ui-sdk/src/modules/Appearance/components/wt-dark-mode-switcher.vue';

const release = process.env.VUE_APP_PACKAGE_VERSION;
const build = process.env.VUE_APP_BUILD_NUMBER;

const store = useStore();
const router = useRouter();

const userinfo = computed(() => store.state.userinfo);
const currentApp = userinfo.value.thisApp;

const checkAccess = computed(() => store.getters['userinfo/CHECK_APP_ACCESS']);
const darkMode = computed(() => store.getters['appearance/DARK_MODE']);

const { t } = useI18n();

const apps = computed(() => {
  const agent = {
    name: WebitelApplications.AGENT,
    href: process.env.VUE_APP_AGENT_URL,
  };
  const supervisor = {
    name: WebitelApplications.SUPERVISOR,
    href: process.env.VUE_APP_SUPERVISOR_URL,
  };
  const history = {
    name: WebitelApplications.HISTORY,
    href: process.env.VUE_APP_HISTORY_URL,
  };
  const audit = {
    name: WebitelApplications.AUDIT,
    href: process.env.VUE_APP_AUDIT_URL,
  };
  const admin = {
    name: WebitelApplications.ADMIN,
    href: process.env.VUE_APP_ADMIN_URL,
  };
  const grafana = {
    name: WebitelApplications.ANALYTICS,
    href: process.env.VUE_APP_GRAFANA_URL,
  };
  const crm = {
    name: WebitelApplications.CRM,
    href: process.env.VUE_APP_CRM_URL,
  };

  const config = inject('$config');

  const allApps = [admin, supervisor, agent, history, audit, crm];
  if (config?.ON_SITE) allApps.push(grafana);
  return allApps.filter(({ name }) => checkAccess.value(name));
});

const nav = computed(() => {
  const contacts = {
    value: CrmSections.CONTACTS,
    name: t(`WebitelApplications.${WebitelApplications.CRM}.sections.${CrmSections.CONTACTS}`),
    route: '/contacts',
  };
  const nav = [contacts];
  return nav.filter((nav) => checkAccess.value({ name: nav.value }));
});

function settings() {
  const settingsUrl = process.env.VUE_APP_SETTINGS_URL;
  window.open(settingsUrl);
}

async function logoutUser() {
  await authAPI.logout();
  await router.replace('/auth');
}

function setLanguage() {
  const lang = localStorage.getItem('lang');
  const { locale } = useI18n();
  if (lang) locale.value = lang;
}

onMounted(() => {
  setLanguage();
});

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
