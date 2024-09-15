import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { mapActions, mapState } from 'vuex';
import AccessMode from '../../../../modules/permissions/modules/objects/store/_internals/enums/AccessMode.enum';
import tableComponentMixin from '../objectTableMixin/tableComponentMixin';
import openedTabComponentMixin from '../openedObjectTabMixin/openedTabComponentMixin';

export default {
  mixins: [openedTabComponentMixin, tableComponentMixin],
  data: () => ({
    isRoleSelectPopup: false,
    accessMode: AccessMode,
  }),
  destroyed() {
    this.resetState();
  },
  computed: {
    ...mapState({
      parentId(state) {
        return getNamespacedState(state, `${this.namespace}`).itemId;
      },
      headersValue(state) {
        return getNamespacedState(state, `${this.namespace}/${this.subNamespace}`).headers;
      },
      dataListValue(state) {
        return getNamespacedState(state, `${this.namespace}/${this.subNamespace}`).dataList;
      },
      page(state) {
        return getNamespacedState(state, `${this.namespace}/${this.subNamespace}`).page;
      },
      size(state) {
        return getNamespacedState(state, `${this.namespace}/${this.subNamespace}`).size;
      },
      search(state) {
        return getNamespacedState(state, `${this.namespace}/${this.subNamespace}`).search;
      },
      isNext(state) {
        return getNamespacedState(state, `${this.namespace}/${this.subNamespace}`).isNextPage;
      },
      permissionId() {
        return this.$route.params.permissionId;
      },
    }),
    headers() {
      if (!this.headersValue) return [];
      return this.headersValue.map((header) => ({
        ...header,
        text:
          typeof header.locale === 'string' ? this.$t(header.locale) : this.$t(...header.locale),
      }));
    },
    dataList() {
      return this.dataListValue.map((item) => {
        const access = {};
        Object.keys(item.access).forEach((rule) => {
          access[rule] = {
            ...item.access[rule],
            name: this.$t(`objects.permissions.object.accessMode.${item.access[rule].id}`),
          };
        });
        return {
          ...item,
          access,
        };
      });
    },
    accessOptions() {
      return Object.values(AccessMode).map((mode) => ({
        id: mode,
        name: this.$t(`objects.permissions.object.accessMode.${mode}`),
      }));
    },
  },

  methods: {
    ...mapActions({
      setParentId(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/SET_PARENT_ITEM_ID`, payload);
      },
      loadDataList(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/LOAD_DATA_LIST`, payload);
      },
      setSize(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/SET_SIZE`, payload);
      },
      setSearch(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/SET_SEARCH`, payload);
      },
      nextPage(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/NEXT_PAGE`, payload);
      },
      prevPage(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/PREV_PAGE`, payload);
      },
      dispatchSort(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/SORT`, payload);
      },
      changeCreateAccessMode(dispatch, payload) {
        return dispatch(
          `${this.namespace}/${this.subNamespace}/CHANGE_CREATE_ACCESS_MODE`,
          payload,
        );
      },
      changeReadAccessMode(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/CHANGE_READ_ACCESS_MODE`, payload);
      },
      changeUpdateAccessMode(dispatch, payload) {
        return dispatch(
          `${this.namespace}/${this.subNamespace}/CHANGE_UPDATE_ACCESS_MODE`,
          payload,
        );
      },
      changeDeleteAccessMode(dispatch, payload) {
        return dispatch(
          `${this.namespace}/${this.subNamespace}/CHANGE_DELETE_ACCESS_MODE`,
          payload,
        );
      },
      resetState(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/RESET_ITEM_STATE`, payload);
      },
    }),
    addItem() {
      return this.$router.push({
        ...this.$route,
        params: { permissionId: 'new' },
      });
    },
    openRoleSelectPopup() {
      this.isRoleSelectPopup = true;
    },
    closeRoleSelectPopup() {
      this.$router.go(-1);
      this.isRoleSelectPopup = false;
    },
  },
  watch: {
    permissionId: {
      handler(value) {
        if (value === 'new') {
          this.openRoleSelectPopup();
        }
      },
      immediate: true,
    },
  }
};
