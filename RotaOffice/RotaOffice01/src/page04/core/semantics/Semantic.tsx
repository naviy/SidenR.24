import { EnumInfo, EnumItemInfo, type EnumInfoProps, type EnumItemInfoProps } from "./EnumInfo";
import { Info, type InfoProps } from "./Info";





//===






export * from "./Info";
export * from "./utils";






//===




export function Factory<F extends {}>(
	one: string,
	many: string,
	props?: InfoProps,
	fields?: F
): Info & F;


export function Factory<F extends {}>(
	one: string,
	props?: InfoProps,
	fields?: F
): Info & F;


export function Factory<F extends {}>(
	props: InfoProps,
	fields?: F
): Info & F;


export function Factory<F>(): typeof Factory;


export function Factory(
	arg0?: any,
	arg1?: any,
	arg2?: any,
	arg3?: any,
): any
{

	if (arg0 === undefined)
	{
		return Factory;
	}


	if (typeof arg0 === "string")
	{

		if (typeof arg1 === "string")
			return new Info({ one: arg0, many: arg1, ...arg2 }, arg3);

		return new Info({ one: arg0, ...arg1 }, arg2);
	}


	return new Info(arg0, arg1);

}






//===






export module Factory
{


	//---




	export type EnumItemFactory<TEnumType> = (

		<TValue extends number | string, F extends Object>(

			value: TValue,
			one: string,
			props?: EnumItemInfoProps,
			fields?: F

		) => EnumItemInfo<EnumInfo<TEnumType>, TValue, F> & F

	);



	export function enums<TEnumType, F extends {}>(
		enums: TEnumType,
		one: string,
		props: EnumInfoProps,
		items: (items: EnumItemFactory<TEnumType>) => F
	): EnumInfo & F;

	export function enums<TEnumType, F>(
		enums: TEnumType,
		one: string,
		items: (items: EnumItemFactory<TEnumType>) => F
	): EnumInfo & F;


	export function enums(enumType: any, one: string, arg2: any, arg3?: any): any
	{

		let props: EnumInfoProps | null;
		let items: (items: EnumItemFactory<any>) => any;


		[props, items] = arg3 === undefined ? [null, arg2] : [arg2, arg3];


		let enums = new EnumInfo(enumType, { one, ...props }, null);

		let fields = items(
			(value, one, props, fields) => new EnumItemInfo(enums, value, { one, ...props }, fields) as any
		);


		enums.$appendFields(fields);


		return enums;

	}




	//---


}






//===






export function create<T>(init: (f: typeof Factory) => T)
{
	return init(Factory);
}