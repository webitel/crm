import accessControlMixin from '../../../baseMixins/accessControlMixin/accessControlMixin';

export default {
  mixins: [accessControlMixin],
  computed: {
    hasSaveActionAccess() {
      if (this.$route.params.id === 'new') return this.hasEditAccess;
      return this.hasCreateAccess;
    },
  },
};
