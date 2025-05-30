<template>
  <div class="case-persons">
    <span class="case-persons__title">{{ t('cases.persons') }}</span>
    <div class="case-persons__wrapper">
      <editable-field
        :label="t('cases.author')"
        :value="itemInstance.createdBy?.name || userinfo.name"
        color="info"
        icon="case-author"
        horizontal-view
      />

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.reporter')"
        :link="getContactLinkPreview(itemInstance.reporter?.id)"
        :value="itemInstance.reporter"
        color="info"
        icon="reporter"
        horizontal-view
        required
        @update:value="handleReporterInput"
        @on-link-action="getContactLink(itemInstance.reporter?.id)"
      >
        <template #default="props">
          <wt-select
            v-bind="props"
            :search-method="ContactsAPI.getLookup"
            :disabled="disableUserInput"
            :v="v$.value.itemInstance.reporter"
            class="case-persons__select"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.impacted')"
        :value="itemInstance.impacted"
        :link="getContactLinkPreview(itemInstance.impacted?.id)"
        icon="impacted"
        horizontal-view
        @update:value="setItemProp({ path: 'impacted', value: $event })"
        @on-link-action="getContactLink(itemInstance.impacted?.id)"
      >
        <template #default="props">
          <wt-select
            v-bind="props"
            :disabled="disableUserInput"
            :search-method="ContactsAPI.getLookup"
            class="case-persons__select"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.assignee')"
        :link="getContactLinkPreview(itemInstance.assignee?.id)"
        :value="itemInstance.assignee"
        color="success"
        icon="assignee"
        horizontal-view
        @update:value="
          setItemProp({
            path: 'assignee',
            value: { id: $event.id, name: $event.name },
          })
        "
        @on-link-action="getContactLink(itemInstance.assignee?.id)"
      >
        <template #default="props">
          <wt-select
            :search-method="ContactsAPI.getLookup"
            :disabled="disableUserInput || isAssignMeDisabled"
            class="case-persons__select"
            v-bind="props"
            @input="props.updateValue($event)"
            @reset="resetAssignee"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.groupPerformers')"
        :disabled="disableUserInput"
        :value="itemInstance.group"
        color="success"
        icon="group"
        horizontal-view
        @update:value="setItemProp({ path: 'group', value: $event })"
      >
        <template #default="props">
          <wt-select
            :disabled="disableUserInput"
            :search-method="loadStaticContactGroupsList"
            class="case-persons__select"
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>
    </div>
  </div>
</template>

<script setup>
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { isEmpty } from '@webitel/ui-sdk/src/scripts/index';
import { computed, inject, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { WebitelContactsGroupType } from 'webitel-sdk';

import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';
import ContactGroupsAPI from '../../../../configuration/modules/lookups/modules/contact-groups/api/contactGroups.js';
import ContactsAPI from '../../../../contacts/api/ContactsAPI.js';
import EditableField from '../../case-info/components/editable-field.vue';

const store = useStore();
const { t } = useI18n();
const router = useRouter()

const namespace = inject('namespace');
const editMode = inject('editMode');
const isReadOnly = inject('isReadOnly');
const v$ = inject('v$');

const { disableUserInput } = useUserAccessControl();

const {
  namespace: cardNamespace,
  itemInstance,
  setItemProp,
} = useCardStore(namespace);

const { isNew } = useCardComponent({
  itemInstance,
});

function loadStaticContactGroupsList(params) {
  return ContactGroupsAPI.getLookup({
    ...params,
    type: WebitelContactsGroupType.STATIC,
    enabled: true,
  });
}

const userinfo = computed(() => store.state.userinfo);

const serviceGroup = computed(
  () => store.getters[`${cardNamespace}/service/GROUP`],
);
const serviceAssignee = computed(
  () => store.getters[`${cardNamespace}/service/ASSIGNEE`],
);

const serviceId = computed(
  () => store.getters[`${cardNamespace}/service/SERVICE_ID`],
);

function handleReporterInput(value) {
  setItemProp({
    path: 'reporter',
    value: value,
  });

  if (isEmpty(itemInstance.value.impacted)) {
    setItemProp({
      path: 'impacted',
      value: value,
    });
  }
}

const isAssignMeDisabled = ref(false);

function resetAssignee(value) {
  setItemProp({ path: 'assignee', value });
}

watch(
  [serviceId, serviceGroup, serviceAssignee],
  ([newServiceId, newGroup, newAssignee], [oldServiceId]) => {
    // this if statement needed so when we enter old case we don't reset assignee and group
    if ((oldServiceId && newServiceId !== oldServiceId) || isNew.value) {
      setItemProp({ path: 'group', value: newGroup });
      setItemProp({ path: 'assignee', value: newAssignee });
    }
  },
  { deep: true },
);

watch(
  () => itemInstance.value.group,
  (newValue) => {
    const isDynamicGroup = newValue?.type === WebitelContactsGroupType.DYNAMIC;

    if (isDynamicGroup) {
      resetAssignee();
      isAssignMeDisabled.value = true;
    } else {
      isAssignMeDisabled.value = false;
    }
  },
  { deep: true },
);

const CONTACT_VIEW_NAME = 'contact_view';
const linkData = (name, id) => {
  return {
    name,
    params: { id },
  }
}

const getContactLinkPreview = (id) => {
  if (!isReadOnly) {
    return linkData(`${CrmSections.CONTACTS}-card`, id)
  }

  return linkData(CONTACT_VIEW_NAME, ':etag')
}

/**
 * @author @Oleksandr Palonnyi
 *
 * This function opens a new tab with the contact link. This is made to handle read-only mode
 * in which we must pass etag instead of id, and etag we can get only from the API while clicking on link.
 * */
const getContactLink = async (id) => {
  if (!isReadOnly) {
    const url = router.resolve(linkData(`${CrmSections.CONTACTS}-card`, id)).href
    window.open(url, '_blank', 'noopener')
    return
  }

  const { etag } = await ContactsAPI.get({ itemId: id })
  const url = router.resolve(linkData(CONTACT_VIEW_NAME, etag)).href

  window.open(url, '_blank', 'noopener')
}
</script>

<style lang="scss" scoped>
@use '@webitel/ui-sdk/src/css/main' as *;

.case-persons {
  width: 100%;

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    padding: var(--spacing-xs);
  }

  &__title {
    display: block;
    @extend %typo-heading-4;
    padding: var(--spacing-xs);
  }

  &__list-item {
    display: flex;
    justify-content: space-between;
    padding: var(--spacing-xs) 0;
    gap: var(--spacing-xs);
  }

  &__info {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xs);
  }

  &__author {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  &__label {
    font-weight: bold;
    @extend %typo-body-1;
  }

  &__select {
    padding: var(--spacing-xs) 0;
  }
}
</style>
