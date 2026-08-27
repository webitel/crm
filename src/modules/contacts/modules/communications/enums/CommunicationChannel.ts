export const CommunicationChannel = {
	Email: 'email',
	Number: 'number',
	Messaging: 'messaging',
} as const;

export type CommunicationChannel =
	(typeof CommunicationChannel)[keyof typeof CommunicationChannel];
