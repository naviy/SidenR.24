export type Constructor<
	T extends Object = {},
	TArgs extends any[] = any[]
> = new (...args: TArgs) => T;