import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { mapActions, mapState } from 'vuex';
import baseObjectMixin from '../../baseMixins/baseObjectMixin/baseObjectMixin';

/**
 * @fileOverview contains nestedObject common logic
 *      (popup entity inside objectTab like opened-agent-skills-popup.vue)
 * @param {string} this.namespace - should be declared in data()
 *      and contain a string name for storeModule like 'ccenter/agents/skills'
 * @extends baseObjectMixin
 */
export default {
  mixins: [baseObjectMixin],

  computed: {
    ...mapState({
      id(state) {
        return getNamespacedState(state, this.namespace).itemId;
      },
      itemInstance(state) {
        return getNamespacedState(state, this.namespace).itemInstance;
      },
    }),
  },

  methods: {
    ...mapActions({
      setItemProp(dispatch, payload) {
        return dispatch(`${this.namespace}/SET_ITEM_PROPERTY`, payload);
      },
      setId(dispatch, payload) {
        return dispatch(`${this.namespace}/SET_ITEM_ID`, payload);
      },
    }),

    async save() {
      const invalid = this.checkValidations();
      if (!invalid) {
        try {
          if (this.id) {
            await this.updateItem();
          } else {
            await this.addItem();
          }
          this.close();
        } catch {}
      }
    },

    close() {
      this.$emit('close');
    },
  },
};
