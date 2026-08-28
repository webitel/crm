export type DynamicFieldValue =
	| string
	| number
	| boolean
	| {
			id?: string;
			name?: string;
	  }
	| Array<{
			id?: string;
			name?: string;
	  }>
	| null;
