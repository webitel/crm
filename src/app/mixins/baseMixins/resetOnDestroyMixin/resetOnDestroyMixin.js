import { mapActions } from 'vuex';

export default {
  destroyed() {
    this.resetState();
  },

  methods: {
    ...mapActions({
      resetState(dispatch, payload) {
        return dispatch(`${this.namespace}/RESET_ITEM_STATE`, payload);
      },
    }),
  },
};
