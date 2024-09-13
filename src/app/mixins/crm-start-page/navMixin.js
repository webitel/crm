import { mapGetters } from 'vuex';
import CrmSections
  from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum';
import CrmConfigurationSections
  from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmConfigurationSections.enum';

export default {
  computed: {
    ...mapGetters('userinfo', {
      checkNavAccess: 'ALLOW_SECTION_ACCESS',
    }),
    nav() {
      return [{
        value: CrmSections.CONTACTS,
        route: '/contacts',
        class: 'cc_contacts',
      }, {
        value: CrmSections.CONFIGURATION,
        route: '/configuration',
        class: 'cc_configuration',
        name: 'configuration'
      }];
    },
    navConfiguration(){
      return [{
        value: CrmConfigurationSections.LOOKUPS,
        route: '/lookups',
        name: 'Lookups',
        subNav: [
          {
            value: CrmConfigurationSections.CONTACT_GROUPS,
            name: "Contact groups",
            route: "contact-groups",

          },
        ]
      }]
    }
  },
};
