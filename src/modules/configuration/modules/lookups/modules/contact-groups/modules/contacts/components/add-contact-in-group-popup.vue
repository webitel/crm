<template>
  <wt-popup
    :shown="!!conditionId"
    class="add-contacts-popup"
    size="sm"
    overflow
    @close="close"
  >
    <template #title>
      {{
        t('contacts.addContacts')
      }}
    </template>

    <template #main>
      <div class="add-contacts-popup__wrapper">
        <div class="add-contacts-popup__filters">
<!--          <dynamic-filter-search-->
<!--            :filters-manager="filtersManager"-->
<!--            :is-filters-restoring="isFiltersRestoring"-->
<!--          />-->

          <has-option-filter-value-field
            :model-value="filters.user"
            :label="t('webitelUI.filters.user')"
            @update:model-value="filters.user = $event"
          />

          <wt-select
            :close-on-select="false"
            :search-method="ContactGroupsAPI.getLookup"
            :value="filters.group"
            :label="t('webitelUI.filters.group')"
            multiple
            use-value-from-options-by-prop="id"
            @input="filters.group = $event"
          />

          <wt-action-bar
            :include="[IconAction.CLEAR]"
            @click:add="() => {}"
          />
        </div>

<!--        <contacts-table></contacts-table>-->
      </div>
    </template>

    <template #actions>
      <wt-button
        :disabled="disabledSave"
        @click="save"
      >
        {{ t('reusable.add') }}
      </wt-button>

      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import HasOptionFilterValueField from '@webitel/ui-datalist/src/filters/components/filter-options/_shared/has-options/has-option-filter-value-field.vue';
import UsersAPI from '@webitel/ui-sdk/api/clients/users/users';
import { IconAction } from '@webitel/ui-sdk/enums';
import ContactsAPI from '@webitel/ui-sdk/src/api/clients/сontacts/contacts';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import IsEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { WebitelContactsGroupType } from 'webitel-sdk';

import ContactsTable from '../../../../../../../../_shared/modules/contacts/components/contacts-table';
import ContactGroupsAPI from '../../../api/contactGroups';

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
  itemInstance,
  resetState,
  addItem,
  loadItem,
  updateItem,
  setId,
  setItemProp,
  id,
} = useCardStore(props.namespace);

const filters = ref({
  search: '',
  user: null,
  group: null,
  label: null,
})

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
    groupId: itemInstance.value.group?.id,
  });
}

async function setGroups(value) {
  await setItemProp({ path: 'group', value });

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
.add-contacts-popup__wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
