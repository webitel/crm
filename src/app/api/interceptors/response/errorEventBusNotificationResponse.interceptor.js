import eventBus from '@webitel/ui-sdk/src/scripts/eventBus';

const onFulfilled = (response) => response;

const onReject = (config) => (error) => {
  if (!config.errors.silent) {
    eventBus.$emit('notification', {
      type: 'error',
      text: error.response.data.detail || error.response.data.message,
    });
  }
  return Promise.reject(error);
};

const setup = (config = {}) => [
  onFulfilled,
  onReject(config),
];

const errorEventBusNotificationResponse = {
  setup,
  default: [
    onFulfilled,
    onReject,
  ],
};

export default errorEventBusNotificationResponse;
