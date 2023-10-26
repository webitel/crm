<template>
  <section class="opened-contact-communications">
    <header class="opened-contact-communications-header">
      <add-communication-popup
        v-if="isCommunicationPopup"
        :initial-channel="currentTab.channel"
        :callback="saveCommunication"
        @close="isCommunicationPopup = false"
      ></add-communication-popup>
      <wt-button
        v-for="(tab) of tabs"
        :key="tab.value"
        :disabled="currentTab.value === tab.value"
        :color="currentTab.value !== tab.value && 'secondary'"
        wide
        @click="currentTab = tab"
      >
        <wt-icon
          :icon="tab.icon"
        ></wt-icon>
        {{ tab.label }}
      </wt-button>
      <wt-button
        :disabled="!access.hasRbacEditAccess"
        @click="isCommunicationPopup = true"
      >{{ t('reusable.add') }}
      </wt-button>
    </header>
    <component
      :is="currentTab.component"
      :namespace="currentTab.namespace"
    ></component>
  </section>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import TheEmails from '../modules/emails/components/the-emails.vue';
import ThePhones from '../modules/phones/components/the-phones.vue';
import AddCommunicationPopup from './opened-contact-communication-popup.vue';

const access = inject('access');

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const emailsNamespace = `${props.namespace}/emails`;
const phonesNamespace = `${props.namespace}/phones`;

const store = useStore();
const { t } = useI18n();

const tabs = computed(() => [
  {
    value: 'phones',
    label: t('vocabulary.phones', 2),
    component: ThePhones,
    namespace: phonesNamespace,
    icon: 'call',
    channel: 'number', // must be same as comm popup channel
  },
  {
    value: 'emails',
    label: t('vocabulary.emails', 2),
    component: TheEmails,
    namespace: emailsNamespace,
    icon: 'email',
    channel: 'email', // must be same as comm popup channel
  },
]);

const currentTab = ref(tabs.value[0]);

const isCommunicationPopup = ref(false);

function saveCommunication({ channel, type, destination }) {
  const itemInstance = { type, [channel]: destination };
  if (channel === 'email') return store.dispatch(`${emailsNamespace}/table/ADD_EMAIL`, { itemInstance });
  if (channel === 'number') return store.dispatch(`${phonesNamespace}/table/ADD_PHONE`, { itemInstance });
  throw TypeError(`Unknown communication channel: ${channel}`);
}
</script>

<style lang="scss" scoped>
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
