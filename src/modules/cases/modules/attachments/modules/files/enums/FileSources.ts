export const FileSources = {
	Chat: 'chat',
	Direct: 'direct',
} as const;

export type FileSources = (typeof FileSources)[keyof typeof FileSources];
