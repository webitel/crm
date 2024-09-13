import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { mapActions, mapGetters, mapState } from 'vuex';
import baseTableMixin from '../../baseMixins/baseTableMixin/baseTableMixin';
import objectTableAccessControlMixin from './_internals/objectTableAccessControlMixin';

/**
 * @fileOverview contains main tables (like the-contact-groups.vue) common logic
 * @param {string} this.namespace - should be declared in data()
 *      and contain a string name for storeModule like 'ccenter/agents/skills'
 * @param {string} this.routeName - should be declared in data()
 *      and contain a string name for edit and new entity route names
 *      like 'cc-agent' for create() and edit() method standardization
 * @extends baseTableMixin, objectTableAccessControlMixin
 */
export default {
  mixins: [baseTableMixin, objectTableAccessControlMixin],
  computed: {
    ...mapState({
      headersValue(state) {
        return getNamespacedState(state, this.namespace).headers;
      },
      dataList(state) {
        console.warn(getNamespacedState(state, this.namespace));
        return getNamespacedState(state, this.namespace).dataList;
      },
      page(state) {
        return getNamespacedState(state, this.namespace).page;
      },
      size(state) {
        return getNamespacedState(state, this.namespace).size;
      },
      search(state) {
        return getNamespacedState(state, this.namespace).search;
      },
      isNext(state) {
        return getNamespacedState(state, this.namespace).isNextPage;
      },
    }),
    ...mapGetters('appearance', {
      darkMode: 'DARK_MODE',
    }),
    headers() {
      if (!this.headersValue) return [];
      return this.headersValue.map((header) => {
        let localizedText;
        // set "false" if no locale prop

        if (header.locale) {
          localizedText = !header.locale || typeof header.locale === 'string'
              ? this.$t(header.locale)
              : this.$t(...header.locale);
        }
        return {
          ...header,
          text: localizedText || header.text,
        };
      });
    },
    selectedRows() {
      return this.dataList.filter((item) => item._isSelected);
    },
    // shows delete table action if some items are selected
    anySelected() {
      return !this.selectedRows?.length;
    },
  },
  methods: {
    ...mapActions({
      loadDataList(dispatch, payload) {
        return dispatch(`${this.namespace}/LOAD_DATA_LIST`, payload);
      },
      setSize(dispatch, payload) {
        return dispatch(`${this.namespace}/SET_SIZE`, payload);
      },
      setSearch(dispatch, payload) {
        return dispatch(`${this.namespace}/SET_SEARCH`, payload);
      },
      nextPage(dispatch, payload) {
        return dispatch(`${this.namespace}/NEXT_PAGE`, payload);
      },
      prevPage(dispatch, payload) {
        return dispatch(`${this.namespace}/PREV_PAGE`, payload);
      },
      dispatchSort(dispatch, payload) {
        return dispatch(`${this.namespace}/SORT`, payload);
      },
      dispatchDelete(dispatch, payload) {
        return dispatch(`${this.namespace}/DELETE`, payload);
      },
      patchItem(dispatch, payload) {
        return dispatch(`${this.namespace}/PATCH_ITEM_PROPERTY`, payload);
      },
      resetState(dispatch, payload) {
        return dispatch(`${this.namespace}/RESET_ITEM_STATE`, payload);
      },
    }),
    create() {
      this.resetState();
      this.$router.push({ name: `${this.routeName}-card`, params: { id: 'new' } });
    },
    edit(item) {
      this.resetState();
      this.$router.push(this.editLink(item));
    },
    sort(...params) {
      this.dispatchSort({
        header: params[0],
        nextSortOrder: params[1],
      });
    },
  },
};
