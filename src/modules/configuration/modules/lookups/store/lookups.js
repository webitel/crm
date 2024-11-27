import slas from '../modules/slas/store/slas.js';
import sources from '../modules/sources/store/sources.js';

const modules = {
  slas,
  sources,
};

export default {
  namespaced: true,
  modules,
};
