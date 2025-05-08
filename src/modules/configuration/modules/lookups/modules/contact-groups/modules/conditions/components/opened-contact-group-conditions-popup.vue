<template>
  <wt-popup
    :shown="!!conditionId"
    class="opened-contact-group-conditions-popup"
    size="sm"
    overflow
    @close="close"
  >
    <template #title>
      {{
        !isNew
          ? t('lookups.slas.editCondition')
          : t('lookups.slas.addCondition')
      }}
    </template>
    <template #main>
      <form class="opened-contact-group-conditions-popup__wrapper">
        <wt-input
          :value="itemInstance.expression"
          :label="t('lookups.slas.conditions', 1)"
          :v="v$.itemInstance.expression"
          required
          @input="setItemProp({ path: 'expression', value: $event })"
        />
        <wt-select
          :value="itemInstance.group"
          :v="v$.itemInstance.group"
          :label="t('lookups.contactGroups.contactGroups', 1)"
          :search-method="loadStaticContactGroupsList"
          required
          @input="setGroups"
        />
        <wt-select
          :disabled="!itemInstance.group"
          :value="itemInstance.assignee"
          :label="t('lookups.contactGroups.assignee')"
          :options="contactList"
          @input="setItemProp({ path: 'assignee', value: $event })"
        />
      </form>
    </template>
    <template #actions>
      <wt-button
        :disabled="disabledSave"
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
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import ContactsAPI from '@webitel/ui-sdk/src/api/clients/сontacts/contacts.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import IsEmpty from '@webitel/ui-sdk/src/scripts/isEmpty.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { WebitelContactsGroupType } from 'webitel-sdk';

import ContactGroupsAPI from '../../../api/contactGroups.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['load-data']);
const route = useRoute();
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

const v$ = useVuelidate(
  computed(() => ({
    itemInstance: {
      expression: { required },
      group: { required },
    },
  })),
  { itemInstance },
  { $autoDirty: true, $stopPropagation: true },
);
v$.value.$touch();

const conditionId = computed(() => route.params.conditionId);
const isNew = computed(() => conditionId.value === 'new');
const contactList = ref([]);

const { close } = useClose(`${CrmSections.CONTACT_GROUPS}-conditions`);
const disabledSave = computed(() => v$.value?.$invalid || !itemInstance.value._dirty);

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
  return await ContactGroupsAPI.getLookup({
    ...params,
    type: WebitelContactsGroupType.STATIC,
    enabled: true,
  });
}

async function loadContacts(params) {
  return await ContactsAPI.getLookup({
    ...params,
    group: itemInstance.value.group?.id,
  });
}

async function setGroups(value) {
  await setItemProp({ path: 'group', value });
  contactList.value = [];

  if (!IsEmpty(itemInstance.value.assignee)) {
    await setItemProp({ path: 'assignee', value: '' });
  }

  if (!IsEmpty(value)) {
    const { items } = await loadContacts();
    if (items.length) {
      contactList.value = items;
    }
  }
}

async function initializePopup() {
  if (!isNew.value) {
    await setId(conditionId.value);
    await loadItem();
  }
}

watch(
  () => conditionId.value,
  (value) => {
    if (value) {
      initializePopup();
    } else {
      resetState();
    }
  },
  { immediate: true },
);
</script>
<style lang="scss" scoped>
.opened-contact-group-conditions-popup__wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
