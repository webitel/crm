import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { mapActions, mapState } from 'vuex';
import RolesAPI from '../../../../modules/permissions/modules/roles/api/roles';

export default {
  props: {
    namespace: {
      type: String,
      required: true,
    },
    subNamespace: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    newGrantee: '',
  }),
  computed: {
    ...mapState({
      dataList(state) {
        return getNamespacedState(state, `${this.namespace}/${this.subNamespace}`).dataList;
      },
    }),
  },
  methods: {
    ...mapActions({
      addRolePermissions(dispatch, payload) {
        return dispatch(`${this.namespace}/${this.subNamespace}/ADD_ROLE_PERMISSIONS`, payload);
      },
    }),
    async save() {
      try {
        await this.addRolePermissions(this.newGrantee);
        this.close();
      } catch (err) {
        throw err;
      }
    },

    // filter new roles
    async getAvailableGrantees(params) {
      const roles = await this.loadRoles(params);
      roles.items = roles.items.filter(
        (role) => !this.dataList.some((usedRoles) => role.id === usedRoles.grantee.id),
      );
      return roles;
    },
    async loadRoles(params) {
      const fields = ['name', 'id', 'user'];
      return RolesAPI.getExtendedRoles({
        ...params,
        fields,
      });
    },
    close() {
      this.$emit('close');
    },
  },
};
