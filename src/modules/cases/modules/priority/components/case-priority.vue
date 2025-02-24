<template>
  <div class="case-priority">
    <span class="case-priority__title">{{ t('cases.priority') }}</span>
    <div>
      <editable-field
        :edit-mode="editMode"
        :value="itemInstance.priority"
        @update:value="setItemProp({ path: 'priority', value: $event });"
      >
        <template #default="props">
          <wt-select
            v-bind="props"
            :clearable="false"
            :disabled="disableUserInput"
            :v="v$.value.itemInstance.priority"
            :placeholder="t('cases.priority')"
            :search-method="PrioritiesAPI.getLookup"
            class="case-priority__select"
            @input="props.updateValue($event)"
          />
        </template>
      </editable-field>
    </div>
  </div>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore.js';
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useUserAccessControl } from '../../../../../app/composables/useUserAccessControl';

import PrioritiesAPI from '../../../../configuration/modules/lookups/modules/priorities/api/priorities.js';
import EditableField from '../../case-info/components/editable-field.vue';

const { t } = useI18n();


const namespace = inject('namespace');
const editMode = inject('editMode');
const v$ = inject('v$');

const { disableUserInput } = useUserAccessControl();

const {
  itemInstance,
  setItemProp,
} = useCardStore(namespace);

const { isNew } = useCardComponent({
  itemInstance,
});

async function setDefaultPriority() {
  const defaultPriority = (await PrioritiesAPI.getLookup({})).items[0];
  await setItemProp({ path: 'priority', value: defaultPriority });
}

if (isNew.value) {
  setDefaultPriority();
}
</script>

<style lang="scss" scoped>
.case-priority {
  width: 100%;

  &__title {
    display: block;
    @extend %typo-heading-4;
  }

  &__select, &__title {
    padding: var(--spacing-xs);
  }
}
</style>
