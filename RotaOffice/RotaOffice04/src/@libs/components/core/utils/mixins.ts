export type Constructor<
	T extends Object = {},
	TArgs extends any[] = any[]
> = new (...args: TArgs) => T;




export module Constructor
{


	export type A<
		T extends Object = {},
		TArgs extends any[] = any[]
	> = abstract new (...args: TArgs) => T;


}