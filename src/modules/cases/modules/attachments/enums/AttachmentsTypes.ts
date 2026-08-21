export const AttachmentsTypes = {
	Files: 'files',
	Links: 'links',
} as const;

export type AttachmentsTypes =
	(typeof AttachmentsTypes)[keyof typeof AttachmentsTypes];
