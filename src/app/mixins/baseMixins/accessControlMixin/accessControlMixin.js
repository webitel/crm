export default {
  computed: {
    hasReadAccess() {
      return this.$store.getters['userinfo/HAS_READ_ACCESS']({
        route: this.$route,
      });
    },
    hasCreateAccess() {
      return this.$store.getters['userinfo/HAS_CREATE_ACCESS']({
        route: this.$route,
      });
    },
    hasEditAccess() {
      return this.$store.getters['userinfo/HAS_EDIT_ACCESS']({
        route: this.$route,
      });
    },
    hasDeleteAccess() {
      return this.$store.getters['userinfo/HAS_DELETE_ACCESS']({
        route: this.$route,
      });
    },
  },
};
