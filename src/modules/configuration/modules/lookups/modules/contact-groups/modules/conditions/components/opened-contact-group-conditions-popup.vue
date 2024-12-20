<template>
  <wt-popup
    :shown="!!conditionId"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ !isNew ? t('reusable.edit') : t('reusable.add') }}
      {{ t('lookups.slas.conditions', 1).toLowerCase() }}
    </template>
    <template #main>
      <form class="opened-card-input-grid opened-card-input-grid--1-col">
        <wt-input
          :value="itemInstance.expression"
          :label="t('lookups.slas.conditions', 1)"
          required
          @input="setItemProp({ path: 'expression', value: $event })"
        />
        <wt-select
          :value="itemInstance.group"
          :label="t('lookups.contactGroups.contactGroups', 1)"
          :search-method="loadStaticContactGroupsList"
          required
          @input="setGroups"
        />
        <wt-select
          :disabled="!itemInstance.group"
          :value="itemInstance.assignee"
          :label="t('lookups.contactGroups.assignee')"
          :search-method="loadContacts"
          @input="setItemProp({ path: 'assignee', value: $event })"
        />
      </form>
    </template>
    <template #actions>
      <wt-button
        @click="save"
      >
        {{ t('reusable.save') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import IsEmpty from '@webitel/ui-sdk/src/scripts/isEmpty.js';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useCardStore } from '@webitel/ui-sdk/store';
import ContactGroupsAPI from '../../../api/contactGroups.js';
import TypesContactGroups from '../../../enums/TypeContactGroups.enum.js';
import ContactsAPI from '@webitel/ui-sdk/src/api/clients/сontacts/contacts.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['load-data']);
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const {
  namespace: cardNamespace,
  itemInstance,
  resetState,
  addItem,
  loadItem,
  updateItem,
  setId,
  setItemProp,
  id,
} = useCardStore(props.namespace);

const conditionId = computed(() => route.params.conditionId);
const isNew = computed(() => conditionId.value === 'new');

const { close } = useClose(`${CrmSections.CONTACT_GROUPS}-conditions`);

function loadDataList() {
  emit('load-data');
}

const save = async () => {
  if (isNew.value) {
    await addItem({ itemInstance, parentId: id.value });
  } else {
    await updateItem({ itemInstance, itemId: id.value });
  }

  close();
  loadDataList();
};

async function loadStaticContactGroupsList(params) {
  return await ContactGroupsAPI.getLookup({ ...params, type: TypesContactGroups.STATIC.toUpperCase() });
}

async function loadContacts(params) {
  return await ContactsAPI.getLookup({ ...params, groupId: itemInstance.value.group.id });
}

async function setGroups(value) {
  await setItemProp({ path: 'group', value });

  if (!IsEmpty(itemInstance.value.assignee)) {
    await setItemProp({ path: 'assignee', value: '' });
  }

  if (!IsEmpty(value)) {
    await loadContacts();
  }
}

async function initializePopup() {
  try {
    if (!isNew.value) {
      await setId(conditionId.value);
      await loadItem();
    }
  } catch (error) {
    throw error;
  }
}

watch(() => conditionId.value, (value) => {
  if (value) {
    initializePopup();
  } else {
    resetState();
  }
}, { immediate: true });
</script>
<style lang="scss" scoped>
</style>
