/**
 * @name TimelinePinType
 * @description Enumerates (ONLY!) the types of timeline pins.
 */

const TimelinePinType = Object.freeze({
  // close expanded
  CLOSE: 'CLOSE',

  // day pin
  DAY: 'DAY',

  // reusable icon pins for points inside tasks
  USER: 'CONTACT',
  AGENT: 'AGENT',
  BOT: 'BOT',

  // chat-related pins
  CHAT_INBOUND: 'CHAT_INBOUND',
  CHAT_TRANSFER: 'CHAT_TRANSFER',
  CHAT_END: 'CHAT_END',


  // call-related pins
  CALL_INBOUND: 'CALL_INBOUND',
  CALL_OUTBOUND: 'CALL_OUTBOUND',
  CALL_MISSED: 'CALL_MISSED',
  CALL_INBOUND_ON_IVR: 'CALL_INBOUND_ON_IVR',
  CALL_TRANSFER: 'CALL_TRANSFER',
});

export default TimelinePinType;
