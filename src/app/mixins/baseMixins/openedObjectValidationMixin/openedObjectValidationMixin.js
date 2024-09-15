/**
 * @fileOverview implements work with validation
 */
export default {
  props: {
    v: {
      type: Object,
    },
  },

  methods: {
    checkValidations() {
      const v = this.v$ ? this.v$ : this.v;
      v.$touch();
      // if its still pending or an error is returned do not submit
      return v.$pending || v.$error;
    },
  },
};
