export const CommunicationType = {
	Phones: 'phones',
	Messaging: 'messaging',
	Emails: 'emails',
} as const;

export type CommunicationType =
	(typeof CommunicationType)[keyof typeof CommunicationType];

export const communicationListFieldByType = {
	[CommunicationType.Phones]: 'phones',
	[CommunicationType.Emails]: 'emails',
	[CommunicationType.Messaging]: 'imclients',
} as const satisfies Record<CommunicationType, string>;
