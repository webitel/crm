import { mapActions } from 'vuex';
import openedObjectValidationMixin from '../openedObjectValidationMixin/openedObjectValidationMixin';
import resetOnDestroyMixin from '../resetOnDestroyMixin/resetOnDestroyMixin';

/**
 * @fileOverview abstract mixin,
 * used by edit-components: main (openedObjectMixin)
 * and nested (nestedObjectMixin) mixins
 * @param {string} this.namespace - should be declared in data()
 *      and contain a string name for storeModule like 'ccenter/agents/skills'
 * @extends openedObjectValidationMixin, openedObjectAccessControlMixin
 */
export default {
  mixins: [resetOnDestroyMixin, openedObjectValidationMixin],

  computed: {
    id() {
      throw new Error('Override id param for a component');
    },
    new() {
      return this.$route.params.id === 'new';
    },
    saveText() {
      // if it's a new item
      // OR any fields have changed
      return !this.id || this.itemInstance._dirty
        ? this.$t('objects.save')
        : this.$t('objects.saved');
    },

    disabledSave() {
      // if there's a validation problem
      // OR it's edit and any fields haven't changed
      return this.checkValidations() || (!this.itemInstance._dirty && !!this.id);
    },
  },

  methods: {
    ...mapActions({
      loadItem(dispatch, payload) {
        return dispatch(`${this.namespace}/LOAD_ITEM`, payload);
      },
      addItem(dispatch, payload) {
        return dispatch(`${this.namespace}/ADD_ITEM`, payload);
      },
      updateItem(dispatch, payload) {
        return dispatch(`${this.namespace}/UPDATE_ITEM`, payload);
      },
    }),

    async save() {
      if (!this.disabledSave) {
        if (!this.new) {
          await this.updateItem();
        } else {
          try {
            await this.addItem();

            if (this.id) {
              await this.redirectToEdit();
            }
          } catch (err) {
            throw err;
          }
        }
      }
    },

    async redirectToEdit(id = this.id) {
      return this.$router.replace({
        ...this.$route,
        params: { id },
      });
    },
  },
};
