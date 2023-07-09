import isEmpty from '@webitel/ui-sdk/src/scripts/isEmpty';
import BaseStoreModule
  from '@webitel/ui-sdk/src/store/BaseStoreModules/BaseStoreModule';
import deepEqual from 'deep-equal';
import router from '../../../../app/router';

export default class FiltersStoreModule extends BaseStoreModule {
  getters = {
    GET_FILTERS: (state, getters) => Object.keys(state)
    .reduce((filters, filterKey) => {
      const filterValue = getters.GET_FILTER(filterKey);
      return isEmpty(filterValue) ? filters : {
        ...filters,
        [filterKey]: filterValue,
      };
    }, {}),
    GET_FILTER: (state) => (filter) => {
      const { value, storedProp, multiple } = state[filter];
      if (multiple) return value.map((item) => item[storedProp]); // if arr, map
      if (storedProp) return value[storedProp]; // if object and has specific prop, return this prop
      return value; // else return val
    },
    GET_VALUE_FROM_QUERY: () => ({ filterQuery }) => (
      router.currentRoute.value.query[filterQuery]
    ),
  };

  actions = {
    SET_FILTER: async (context, { filter, value }) => {
      const { multiple, defaultValue } = context.state[filter];
      let newValue = value;
      if (newValue) {
        if (multiple && !Array.isArray(newValue)) newValue = [newValue];
      } else if (newValue === null || newValue ===
        undefined) newValue = defaultValue;
      await context.dispatch('SET_VALUE_TO_QUERY', {
        filterQuery: filter,
        value,
        storedProp: context.state[filter].storedProp,
      });
      context.commit('SET_FILTER', { filter, value: newValue });
    },
    SET_VALUE_TO_QUERY: async (
      context,
      { filterQuery, value, storedProp = 'id' },
    ) => {
      let newValue = '';
      if (Array.isArray(value)) {
        if (value.length && typeof value[0] !== 'object') {
          newValue = value;
        } else {
          newValue = value.map((item) => item[storedProp]);
        }
      } else if (typeof value === 'object' && value !== null) {
        newValue = value[storedProp];
      } else {
        newValue = value;
      }

      return context.dispatch('CHANGE_ROUTE_QUERY', ({
        value: newValue,
        filterQuery,
      }));
    },
    CHANGE_ROUTE_QUERY: (context, { value, filterQuery }) => {
      if (deepEqual(context.getters.GET_VALUE_FROM_QUERY({ filterQuery }), value)) return;
      const query = { ...router.currentRoute.value.query };
      query[filterQuery] = value;
      // eslint-disable-next-line consistent-return
      return router.replace({
        name: router.currentRoute.value.name,
        query,
      });
    },
    // eslint-disable-next-line consistent-return
    RESTORE_FILTER: (context, { filter }) => {
      const value = context.getters.GET_VALUE_FROM_QUERY({ filterQuery: filter });
      if (value) return context.dispatch('SET_FILTER', ({ filter, value }));
    },
    RESTORE_FILTERS: (context) => {
      Object.keys(context.state)
      .forEach((filter) => context.dispatch('RESTORE_FILTER', { filter }));
    },
    RESET_FILTERS: (context) => {
      context.commit('RESET_FILTERS');
    },
  };

  mutations = {
    SET_FILTER: (state, { filter, value }) => {
      state[filter].value = value;
    },
    RESET_FILTERS: (state) => {
      Object.keys(state).forEach((filter) => {
        state[filter].value = state[filter].defaultValue;
      });
    },
  };
}
