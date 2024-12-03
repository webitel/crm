import slas from '../modules/slas/store/slas.js';
import sources from '../modules/sources/store/sources.js';
import contactGroups from '../modules/contact-groups/store/contactGroups.js';

const modules = {
  slas,
  sources,
  contactGroups,
};

export default {
  namespaced: true,
  modules,
};
