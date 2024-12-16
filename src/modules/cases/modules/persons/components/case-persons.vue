<template>
  <div class="case-persons">
    <span class="case-persons__title">{{ t('cases.persons') }}</span>
    <div v-if="itemInstance.service">
      <editable-field
        :label="t('cases.author') + ':'"
        :value="itemInstance.author?.name || userinfo.name"
        icon="link"
        is-list-mode
      />

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.reporter') + ':'"
        :link="{ name: `${CrmSections.CONTACTS}-card`, params: { id: itemInstance.reporter?.id } }"
        :value="itemInstance.reporter?.name"
        icon="link"
        is-list-mode
        required
        @update:value="setItemProp({ path: 'reporter', value: $event })"
      >
        <template #default="props">
          <wt-select
            :clearable="false"
            :search-method="UsersAPI.getLookup"
            class="case-persons__select"
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.impacted') + ':'"
        :link="{ name: `${CrmSections.CONTACTS}-card`, params: { id: itemInstance.impacted?.id } }"
        :value="itemInstance.impacted?.name"
        icon="link"
        is-list-mode
        required
        @update:value="setItemProp({ path: 'impacted', value: $event })"
      >
        <template #default="props">
          <wt-select
            :clearable="false"
            :search-method="UsersAPI.getLookup"
            class="case-persons__select"
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.assignee') + ':'"
        :link="{ name: `${CrmSections.CONTACTS}-card`, params: { id: itemInstance.assignee?.id } }"
        :value="itemInstance.assignee?.name"
        icon="link"
        is-list-mode
        required
        @update:value="setItemProp({ path: 'assignee', value: $event })"
      >
        <template #default="props">
          <wt-select
            :clearable="false"
            :search-method="UsersAPI.getLookup"
            class="case-persons__select"
            v-bind="props"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>

      <!-- TODO: add Assign to me btn -->

      <editable-field
        :edit-mode="editMode"
        :label="t('cases.group') + ':'"
        :value="itemInstance.group?.name"
        icon="link"
        is-list-mode
        required
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
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { computed, inject, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { useStore } from 'vuex';
import ContactGroupsAPI from '../../../../configuration/modules/lookups/modules/contact-groups/api/contactGroups.js';
import UsersAPI from '../../../../contacts/api/UsersAPI.js';
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
  id,
  itemInstance,
  setItemProp,
} = useCardStore(props.namespace);

// TODO: replace STATIC type with type from TypeContactGroups.enum.js
async function loadStaticContactGroupsList(params) {
  return await ContactGroupsAPI.getLookup({ ...params, type: 'STATIC' });
}

const serviceGroup = computed(() => store.getters[`${props.namespace}/service/GROUP`]);
const serviceAssignee = computed(() => store.getters[`${props.namespace}/service/ASSIGNEE`]);

const userinfo = computed(() => store.state.userinfo);

const editMode = inject('editMode');

watch(serviceGroup, (value) => {
  if (value) {
    setItemProp({ path: 'group', value: value });
  }
});

watch(serviceAssignee, (value) => {
  if (value) {
    setItemProp({ path: 'assignee', value: value });
  }
});
</script>


<style lang="scss" scoped>
.case-persons {
  width: 100%;

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
