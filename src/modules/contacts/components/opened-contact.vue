<template>
  <wt-page-wrapper
    class="opened-contact"
    :actions-panel="false"
  >
    <template v-slot:header>
      <wt-page-header
        :secondary-action="close"
        hide-primary
      >
        <wt-headline-nav :path="path"></wt-headline-nav>
      </wt-page-header>
    </template>
    <template v-slot:main>
      <div class="opened-contact-content">
        <opened-contact-general
          :common-name="itemInstance.name ? itemInstance.name.commonName : ''"
          :timezones="itemInstance.timezones ? itemInstance.timezones.data : []"
          :managers="itemInstance.managers ? itemInstance.managers.data : []"
          :about="itemInstance.about"
          :labels="itemInstance.labels ? itemInstance.labels.data : []"
        ></opened-contact-general>
        <opened-contact-tabs
          :namespace="namespace"
        ></opened-contact-tabs>
      </div>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';
import { onMounted, onUnmounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useClose } from '../../../app/composables/useClose';
import OpenedContactGeneral from './opened-contact-general.vue';
import OpenedContactTabs from './opened-contact-tabs.vue';

const baseNamespace = 'contacts';

const route = useRoute();
const { t } = useI18n();

const {
  namespace,
  id,
  itemInstance,

  loadItem,
  setId,
  resetState,
} = useCardStore(baseNamespace);

const { close } = useClose();

const path = computed(() => {
  const baseUrl = '/contacts';

  return [
    { name: t('crm') },
    { name: t('contacts.contact', 2), route: baseUrl },
    {
      name: itemInstance.value?.name?.commonName || 'Contact',
      route: `/contacts/${id.value}`,
    },
  ];
});

async function initializeCard() {
  const { id: itemId } = route.params;
  await setId(itemId);
  return loadItem();
}

onMounted(() => initializeCard());
onUnmounted(() => resetState());

</script>

<style lang="scss" scoped>
.opened-contact-content {
  flex-grow: 1;
  display: flex;
  gap: var(--spacing-sm);
  min-height: 0;

  .opened-contact-general {
    flex: 0 0 250px;
  }

  .opened-contact-tabs {
    flex: 1 1 auto;
  }
}
</style>
