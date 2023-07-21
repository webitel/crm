<template>
  <section class="opened-contact-communications">
    <header class="opened-contact-communications-header">
      <add-communication-popup
        v-if="isCommunicationPopup"
        :callback="saveCommunication"
        @close="isCommunicationPopup = false"
      ></add-communication-popup>
      <wt-button
        color="secondary"
        wide
      >{{ t('vocabulary.emails', 2) }}
      </wt-button>
      <wt-button
        @click="isCommunicationPopup = true"
      >{{ t('reusable.add') }}
      </wt-button>
    </header>
    <the-emails
      :namespace="emailsNamespace"
    ></the-emails>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import TheEmails from '../modules/emails/components/the-emails.vue';
import AddCommunicationPopup from './opened-contact-communication-popup.vue';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const emailsNamespace = `${props.namespace}/emails`;

const store = useStore();
const { t } = useI18n();

const isCommunicationPopup = ref(false);

function saveCommunication({ channel, type, destination }) {
  const itemInstance = { type, [channel]: destination };
  if (channel === 'email') return store.dispatch(`${emailsNamespace}/table/ADD_EMAIL`, { itemInstance });
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
