<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
      <wt-page-header
        hidePrimary
        :secondary-action="goBack"
        :secondary-text="$t('close')"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>

    <template #main>
      <delete-confirmation-popup
        :shown="isDeleteConfirmationPopup"
        :delete-count="deleteCount"
        :callback="deleteCallback"
        @close="closeDelete"
      />

      <section class="main-section__wrapper">
        <header class="main-section-header">
          <h3 class="content-title">
            {{ $t('lookups.contactGroups.groups') }}
          </h3>
          <div class="main-section-header__actions-wrap">
            <wt-search-bar
              :value="search"
              debounce
              @enter="loadList"
              @input="setSearch"
              @search="loadList"
              placeholder=" "
            />
            <wt-table-actions
              :icons="['refresh']"
              @input="tableActionsHandler"
            >

              <wt-icon-action
                action="add"
                @click="create"
                class="add"
              />

              <delete-all-action
                v-if="hasDeleteAccess"
                :disabled="anySelected"
                :selected-count="selectedRows.length"
                @click="askDeleteConfirmation({
                  deleted: selectedRows,
                  callback: () => deleteData(selectedRows),
                })"
                class="delete"
              />
            </wt-table-actions>
          </div>
        </header>

        <wt-loader v-show="!isLoaded" />
        <wt-dummy
          v-if="isLoaded && !dataList.length"
          :show-action="dummy.showAction"
          :text="dummy.text && $t(dummy.text)"
          :dark-mode="darkMode"
          class="dummy-wrapper"
          @create="create"
        />
        <div
          v-show="dataList.length && isLoaded"
          class="table-wrapper"
        >
          <wt-table
            :data="dataList"
            :grid-actions="hasTableActions"
            :headers="headers"
            sortable
            @sort="sort"
          >
            <template #name="{ item }">
              <wt-item-link
                  :link="'/lookups/contact-groups/' + item.id + '/general'"
              >
                {{ item.name }}
              </wt-item-link>
            </template>
            <template #time="{ item }">
              {{ item.statusDuration }}
            </template>
            <template #actions="{ item }">
              <wt-item-link
                :link="'/lookups/contact-groups/' + item.id + '/general'"
              >
                <wt-icon-action action="edit"/>
              </wt-item-link>
              <wt-icon-action
                v-if="hasDeleteAccess"
                action="delete"
                class="table-action"
                @click="askDeleteConfirmation({
                  deleted: [item],
                  callback: () => deleteData(item),
                })"
              />
            </template>
          </wt-table>
          <wt-pagination
            :next="isNext"
            :prev="page > 1"
            :size="size"
            debounce
            @change="loadList"
            @input="setSize"
            @next="nextPage"
            @prev="prevPage"
          />
        </div>
      </section>
    </template>
  </wt-page-wrapper>
</template>

<script>
import DeleteConfirmationPopup from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/components/delete-confirmation-popup.vue';
import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
import { snakeToCamel } from '@webitel/ui-sdk/src/scripts/caseConverters';
import { useDummy } from '../../../../../../../app/composables/useDummy';
import tableComponentMixin from '../../../../../../../app/mixins/objectPagesMixins/objectTableMixin/tableComponentMixin';
import RouteNames from '../../../../../../../app/router/_internals/RouteNames.enum';

const namespace = 'cgroups/groups';

export default {
  name: 'TheContactGroups',
  components: { DeleteConfirmationPopup },
  mixins: [tableComponentMixin],

  setup() {
    const { dummy } = useDummy({
      namespace,
      showAction: true,
    });
    const {
      isVisible: isDeleteConfirmationPopup,
      deleteCount,
      deleteCallback,

      askDeleteConfirmation,
      closeDelete,
    } = useDeleteConfirmationPopup();

    return {
      dummy,
      isDeleteConfirmationPopup,
      deleteCount,
      deleteCallback,

      askDeleteConfirmation,
      closeDelete,
    };
  },

  data: () => ({
    namespace,
    routeName: `${RouteNames.CONTACT_GROUPS}`,
  }),

  computed: {
    path() {
      return [
        {
          name: this.$t('crm'),
          route: '/start-page'
        },
        {
          name: this.$t('lookups.contactGroups.configurations'),
          route: '/configuration'
        },
        {
          name: this.$t('lookups.lookups'),
        },
        {
          name: this.$t('lookups.contactGroups.contactGroups'),
          route: '/lookups/contact-groups',
        },
      ];
    },
  },

  methods: {
    snakeToCamel,
    editLink(item) {
      return {
        name: item.name,
        params: { id: item.id },
      };
    },
    goBack(){
      this.$router.push({ name: `configuration` });
    }
  },
};
</script>

<style lang="scss" scoped>
  .content-title{
    @extend %typo-heading-4;
  }
  .main-section-header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--spacing-xs) var(--spacing-xs) 0;

    &__actions-wrap{
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);

      :deep(.wt-tooltip){
        order: 2;

        &.add {
          order: 1;
        }
      }
      .delete{
        order: 3;
      }
      :deep(.wt-table-actions){
        padding: 0;
      }
    }
  }
</style>
