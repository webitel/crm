<template>
  <section class="communications">
    <header class="communications__header">
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
    <component :is="currentTab.component" />
  </section>
</template>

<script setup lang="ts">
import { useCardTabs } from '@webitel/ui-sdk/composables';
import { CrmSections } from '@webitel/ui-sdk/enums';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { CONTACT_VIEW_NAME } from '../../../router/contactViewName';
import { CommunicationChannel } from '../enums/CommunicationChannel';
import { CommunicationType } from '../enums/CommunicationType';
import TheEmails from '../modules/emails/components/the-emails.vue';
import TheMessaging from '../modules/messaging/components/the-messaging.vue';
import ThePhones from '../modules/phones/components/the-phones.vue';

const { t } = useI18n();
const route = useRoute();

const currentCardRoute = computed(() => {
	return typeof route.name === 'string' &&
		route.name.includes(CONTACT_VIEW_NAME)
		? CONTACT_VIEW_NAME
		: CrmSections.Contacts;
});

const tabs = computed(() => [
	{
		value: CommunicationType.Phones,
		label: t('vocabulary.phones', 2),
		component: ThePhones,
		icon: 'call',
		channel: CommunicationChannel.Number, // must be same as comm popup channel
		pathName: `${currentCardRoute.value}-communications-phones`,
	},
	{
		value: CommunicationType.Messaging,
		label: t('vocabulary.messaging'),
		component: TheMessaging,
		icon: 'chat',
		channel: CommunicationChannel.Messaging, // must be same as comm popup channel
		pathName: `${currentCardRoute.value}-communications-messaging`,
	},
	{
		value: CommunicationType.Emails,
		label: t('vocabulary.emails', 2),
		component: TheEmails,
		icon: 'email',
		channel: CommunicationChannel.Email, // must be same as comm popup channel
		pathName: `${currentCardRoute.value}-communications-emails`,
	},
]);

type CommunicationTab = (typeof tabs.value)[number];

const { currentTab, changeTab } = useCardTabs<CommunicationTab>(tabs);
</script>

<style
  lang="scss"
  scoped
>
.communications {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.communications__header {
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
