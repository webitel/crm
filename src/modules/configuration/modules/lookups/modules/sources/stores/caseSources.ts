import { z as zod } from 'zod/v4';
// import i18n from '../../../../../../../app/locale/i18n';
// import { createSourceBody as standardValidationSchema } from '@webitel/api-services/gen';

zod.config({
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
});
