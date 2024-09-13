import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import { mapActions, mapState } from 'vuex';

import openedObjectValidationMixin from '../../baseMixins/openedObjectValidationMixin/openedObjectValidationMixin';
import openedObjectTabAccessControlMixin from './_internals/openedObjectTabAccessControlMixin';

/**
 * @fileOverview contains openedObject tab
 *      (tab with subordinate entity, like opened-agent-general.vue) common logic
 * @param {string} this.namespace - should be passed as prop from tabs wrapper
 * @extends openedObjectValidationMixin, openedObjectTabAccessControlMixin
 */
export default {
  mixins: [openedObjectValidationMixin, openedObjectTabAccessControlMixin],
  props: {
    namespace: {
      type: String,
      // required: true, FIXME: MAKE ME REQUIRED AFTER REFACTOR
    },
  },
  computed: {
    ...mapState({
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
      addVariable(dispatch, payload) {
        return dispatch(`${this.namespace}/ADD_VARIABLE_PAIR`, payload);
      },
      deleteVariable(dispatch, payload) {
        return dispatch(`${this.namespace}/DELETE_VARIABLE_PAIR`, payload);
      },
      setVariableProp(dispatch, payload) {
        return dispatch(`${this.namespace}/SET_VARIABLE_PROP`, payload);
      },
    }),
  },
};
