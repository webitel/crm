export const CommunicationType = {
	Phones: 'phones',
	Messaging: 'messaging',
	Emails: 'emails',
} as const;

export type CommunicationType =
	(typeof CommunicationType)[keyof typeof CommunicationType];
