/**
 * @name TimelineTaskKind
 * @description Enumerates kind of task, which is sub-category of task type, like chat, call, email, etc.
 */

const TimelineTaskKind = Object.freeze({
	CALL_INBOUND: 'CALL_INBOUND',
	CALL_OUTBOUND: 'CALL_OUTBOUND',
	CALL_MISSED: 'CALL_MISSED',

	CHAT_INBOUND: 'CHAT_INBOUND',
	// CHAT_OUTBOUND: 'CHAT_OUTBOUND',
	CHAT_ENDED: 'CHAT_ENDED',

	EMAIL_INBOUND: 'EMAIL_INBOUND',
	EMAIL_OUTBOUND: 'EMAIL_OUTBOUND',
});

export default TimelineTaskKind;
