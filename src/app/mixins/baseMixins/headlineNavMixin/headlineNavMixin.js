export default {
  data: () => ({
    pathName: '',
  }),
  watch: {
    'itemInstance._dirty': {
      handler(value) {
        if (!value) this.setPathName();
      },
    },
  },
  methods: {
    setPathName() {
      this.pathName = this.itemInstance.name;
    },
  },
  mounted() {
    // itemInstance._dirty isn't init as "false",
    // so that we should set up first name representation in other way
    const unwatch = this.$watch('itemInstance.name', () => {
      this.setPathName();
      unwatch();
    });
  },
};
