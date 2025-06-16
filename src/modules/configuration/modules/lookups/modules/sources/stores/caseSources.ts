import { z as zod } from 'zod/v4';
import { ua } from 'zod/v4/locales';
// import ua from 'zod/v4/locales/ua.js';
// import i18n from '../../../../../../../app/locale/i18n';
// import { createSourceBody as standardValidationSchema } from '@webitel/api-services/gen';

zod.config(ua()
// {
  // customError: (issue) => {
  //   switch (issue.code) {
  //     case 'too_small':
  //       return i18n.global.t('validation.minLength', {
  //         min: issue.minimum,
  //       });
  //     default:
  //       return 'errrr';
  //
  //   }
  // },
// }
);
