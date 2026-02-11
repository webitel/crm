export const AttachmentsTypes = {
	FILES: 'files',
	LINKS: 'links',
} as const;

export type AttachmentsTypes =
	(typeof AttachmentsTypes)[keyof typeof AttachmentsTypes];
