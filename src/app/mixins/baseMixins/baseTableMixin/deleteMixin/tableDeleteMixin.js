export default {
  methods: {
    deleteData(deleted) {
      return this.dispatchDelete(deleted);
    },
    dispatchDelete() {
      throw new TypeError('implement dispatchDelete method first');
    },
  },
};
