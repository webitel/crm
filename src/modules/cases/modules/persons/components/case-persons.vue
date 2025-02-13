<template>
  <div class="case-persons">
    <span class="case-persons__title">{{ t('cases.persons') }}</span>
    <div class="case-persons__wrapper">
      <editable-field
        :label="t('cases.author')"
        :value="itemInstance.author?.name || userinfo.name"
        color="info"
        icon="case-author"
        horizontal-view
      />

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.reporter')"
        :link="{
          name: `${CrmSections.CONTACTS}-card`,
          params: { id: itemInstance.reporter?.id },
        }"
        :value="itemInstance.reporter?.name"
        color="info"
        icon="reporter"
        horizontal-view
        required
        @update:value="handleReporterInput"
      >
        <template #default="props">
          <wt-select
            :clearable="false"
            :search-method="ContactsAPI.getLookup"
            class="case-persons__select"
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.impacted')"
        :link="{
          name: `${CrmSections.CONTACTS}-card`,
          params: { id: itemInstance.impacted?.id },
        }"
        :value="itemInstance.impacted?.name"
        icon="impacted"
        horizontal-view
        @update:value="setItemProp({ path: 'impacted', value: $event })"
      >
        <template #default="props">
          <wt-select
            :clearable="false"
            :search-method="ContactsAPI.getLookup"
            class="case-persons__select"
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.assignee')"
        :link="{
          name: `${CrmSections.CONTACTS}-card`,
          params: { id: itemInstance.assignee?.id },
        }"
        :value="itemInstance.assignee?.name"
        color="success"
        icon="assignee"
        horizontal-view
        @update:value="
          setItemProp({
            path: 'assignee',
            value: { id: $event.id, name: $event.name },
          })
        "
      >
        <template #default="props">
          <wt-select
            :clearable="false"
            :search-method="ContactsAPI.getLookup"
            class="case-persons__select"
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <!-- TODO: add Assign to me btn -->
      <!-- TODO: also replace editable-field usage with computed and v-for for computed if it will have benefits  -->

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.group')"
        :value="itemInstance.group?.name"
        color="success"
        icon="group"
        horizontal-view
        @update:value="setItemProp({ path: 'group', value: $event })"
      >
        <template #default="props">
          <wt-select
            :clearable="false"
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
import { computed, inject, watch, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

import ContactGroupsAPI from '../../../../configuration/modules/lookups/modules/contact-groups/api/contactGroups.js';
import ContactsAPI from '../../../../contacts/api/ContactsAPI.js';
import EditableField from '../../case-info/components/editable-field.vue';

const store = useStore();
const { t } = useI18n();

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  setItemProp,
} = useCardStore(props.namespace);

const { isNew } = useCardComponent({
  id,
  itemInstance,
});

function handleReporterInput(value) {
  setItemProp({
    path: 'reporter',
    value: value,
  });

  if (!itemInstance.value.impacted) {
    setItemProp({
      path: 'impacted',
      value: value,
    });
  }
}

// TODO: replace STATIC type with type from TypeContactGroups.enum.js
async function loadStaticContactGroupsList(params) {
  return await ContactGroupsAPI.getLookup({ ...params, type: 'STATIC' });
}

const serviceGroup = computed(
  () => store.getters[`${cardNamespace}/service/GROUP`],
);
const serviceAssignee = computed(
  () => store.getters[`${cardNamespace}/service/ASSIGNEE`],
);

const serviceId = computed(
  () => store.getters[`${cardNamespace}/service/SERVICE_ID`],
);

const userinfo = computed(() => store.state.userinfo);

const editMode = inject('editMode');

watch(
  serviceId,
  (newServiceId, oldServiceId) => {
    if (!!oldServiceId || (!oldServiceId && isNew.value)) {
      setItemProp({
        path: 'group',
        value: { id: serviceGroup.value.id, name: serviceGroup.value.name },
      });
      setItemProp({ path: 'assignee', value: serviceAssignee.value });
    }
  },
  { deep: true },
);
</script>

<style lang="scss" scoped>
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
