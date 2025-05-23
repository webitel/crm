<template>
  <wt-popup
    v-bind="$attrs"
    class="add-contacts-popup"
    :shown="isContactListInPath"
    size="lg"
    @close="close"
  >
    <template #title>
      {{
        t('contacts.addContacts', 2)
      }}
    </template>

    <template #main>

      <contact-list-filters-panel />

      <div
        ref="infiniteScrollWrap"
        class="scroll-wrap"
      >
        <wt-table
          :data="dataList"
          :headers="headers"
          :selected="selectedContactList"
          sortable
        >
          <template #name="{ item }">
            <div class="username-wrapper">
              <wt-avatar
                size="xs"
                :username="item.name"
              />{{ item.name }}
            </div>
          </template>

          <template #user="{ item }">
            <wt-icon
              v-if="item.user"
              icon="webitel-logo"
            />
          </template>

          <template #groups="{ item }">
            <div
              v-if="item.groups"
              class="contacts-groups"
            >
              <p>
                {{ item.groups[0]?.name }}
              </p>

              <wt-tooltip
                v-if="item.groups.length > 1"
                :triggers="['click']"
              >
                <template #activator>
                  <wt-chip> +{{ item.groups.length - 1 }}</wt-chip>
                </template>

                <div class="contacts-groups__wrapper">
                  <p
                    v-for="(group, idx) of item.groups.slice(1)"
                    :key="idx"
                  >
                    {{ group.name }}
                  </p>
                </div>
              </wt-tooltip>
            </div>
          </template>

          <template #labels="{ item }">
            <div
              v-if="item.labels"
              class="contacts-labels-wrapper"
            >
              <wt-chip
                v-for="{ label, id } of item.labels"
                :key="id"
              >
                {{ label }}
              </wt-chip>
            </div>
          </template>
        </wt-table>
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

<script lang="ts" setup>
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { storeToRefs } from 'pinia';
import { computed,onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useContactsListStore } from '../stores/contactsList';
import ContactListFiltersPanel from './contact-list-filters-panel.vue';

const props = defineProps<{
  groupIds: string[]
}>();
const emit = defineEmits(['load-data', 'close']);

const { t } = useI18n();

const tableStore = useContactsListStore();

const {
  dataList,
  selected,
  error,
  isLoading,
  page,
  size,
  next,
  headers,
  filtersManager,
} = storeToRefs(tableStore);

const {
  initialize,
  loadDataList,
} = tableStore;

onMounted(() => {
  initialize();
});

const { close } = useClose(`${CrmSections.CONTACT_GROUPS}-contacts`);
const route = useRoute();
const isContactListInPath = computed(() => {
  return route.path.includes('contacts-list');
});

const save = () => {
  close();
}

const infiniteScrollWrap = ref(null);

</script>

<style lang="scss" scoped>
.add-contacts-popup {
  &.wt-popup {
    .wt-popup__main {
      display: flex;
      flex-direction: column;
    }

    .scroll-wrap {
      overflow: auto;
      flex-grow: 1;
      min-height: 0;
    }
  }

  &__filters {
    display: grid;
    align-items: center;
    margin-bottom: var(--spacing-xs);
    grid-template-columns: repeat(4, 1fr) var(--spacing-md);
    gap: var(--spacing-xs);
  }

  .scroll-wrap {
    height: 440px;
  }

  .contacts {
    &-groups {
      display: flex;
      gap: var(--spacing-xs);
    }

    &-labels-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-2xs);
    }
  }

  .username-wrapper {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-xs);

    .wt-avatar {
      flex: 0 0 var(--wt-avatar-size--size-xs);
    }
  }
}
</style>
