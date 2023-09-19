<template>
  <section class="opened-contact-communications">
    <header class="opened-contact-communications-header">
      <add-communication-popup
        v-if="isCommunicationPopup"
        :callback="saveCommunication"
        @close="isCommunicationPopup = false"
      ></add-communication-popup>
      <wt-button
        v-for="(tab) of tabs"
        :key="tab.value"
        color="secondary"
        wide
        @click="currentTab = tab"
      >{{ tab.label }}
      </wt-button>
      <wt-button
        v-if="access.hasRbacEditAccess"
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
  },
  {
    value: 'emails',
    label: t('vocabulary.emails', 2),
    component: TheEmails,
    namespace: emailsNamespace,
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
}
</style>
