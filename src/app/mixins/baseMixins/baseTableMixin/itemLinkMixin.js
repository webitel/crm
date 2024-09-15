import RouteNames from '../../../router/_internals/RouteNames.enum';

export default {
  data: () => ({
    RouteNames,
  }),
  methods: {
    editLink({ id }) {
      const routeName = this.routeName;
      return { name: `${routeName}-card`, params: { id } };
    },
  },
};
