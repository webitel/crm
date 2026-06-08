export const PrioritiesColors = {
	RED: 'red',
	PINK: 'pink',
	PURPLE: 'purple',
	DEEP_PURPLE: 'deep-purple',
	INDIGO: 'indigo',
	BLUE: 'blue',
	LIGHT_BLUE: 'light-blue',
	CYAN: 'cyan',
	TEAL: 'teal',
	GREEN: 'green',
	LIGHT_GREEN: 'light-green',
	LIME: 'lime',
	YELLOW: 'yellow',
	AMBER: 'amber',
	ORANGE: 'orange',
	DEEP_ORANGE: 'deep-orange',
} as const;

export type PrioritiesColors =
	(typeof PrioritiesColors)[keyof typeof PrioritiesColors];
