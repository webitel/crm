<template>
  <section class="opened-contact-communications">
    <header class="opened-contact-communications-header">
      <wt-button
        v-for="(tab) of tabs"
        :key="tab.value"
        :disabled="currentTab.value === tab.value"
        :color="currentTab.value !== tab.value && 'secondary'"
        wide
        @click="changeTab(tab)"
      >
        <wt-icon :icon="tab.icon" />
        {{ tab.label }}
      </wt-button>
    </header>
    <component
      :is="currentTab.component"
      :namespace="currentTab.namespace"
    />
  </section>
</template>

<script setup>
import { CrmSections } from '@webitel/ui-sdk/enums';
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

import TheEmails from '../modules/emails/components/the-emails.vue';
import TheMessaging from '../modules/messaging/components/the-messaging.vue';
import ThePhones from '../modules/phones/components/the-phones.vue';

const access = inject('access');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const emailsNamespace = `${props.namespace}/emails`;
const phonesNamespace = `${props.namespace}/phones`;
const messagingNamespace = `${props.namespace}/messaging`;

const store = useStore();
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const CONTACT_VIEW_NAME = 'contact_view'
const currentCardRoute = computed(() => {
  return typeof route.name === 'string' && route.name.includes(CONTACT_VIEW_NAME) ?
    CONTACT_VIEW_NAME :
    CrmSections.CONTACTS;
});

const tabs = computed(() => [
  {
    value: 'phones',
    label: t('vocabulary.phones', 2),
    component: ThePhones,
    namespace: phonesNamespace,
    icon: 'call',
    channel: 'number', // must be same as comm popup channel
    pathName: `${currentCardRoute.value}-communications-phones`,
  },
  {
    value: 'messaging',
    label: t('vocabulary.messaging'),
    component: TheMessaging,
    namespace: messagingNamespace,
    icon: 'chat',
    channel: 'messaging', // must be same as comm popup channel
    pathName: `${currentCardRoute.value}-communications-messaging`,
  },
  {
    value: 'emails',
    label: t('vocabulary.emails', 2),
    component: TheEmails,
    namespace: emailsNamespace,
    icon: 'email',
    channel: 'email', // must be same as comm popup channel
    pathName: `${currentCardRoute.value}-communications-emails`,
  },
]);

const currentTab = computed(() => tabs.value.find(({ pathName }) => pathName === route.name))

function changeTab(tab) {
  return router.push({ name: tab.pathName });
}

</script>

<style
  lang="scss"
  scoped
>
.opened-contact-communications {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.opened-contact-communications-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);

  .wt-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2xs);
  }
}
</style>
