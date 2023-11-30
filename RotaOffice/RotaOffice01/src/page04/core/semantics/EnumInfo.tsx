import { Info, type InfoProps } from "./Info";






//===






export interface EnumInfoProps extends InfoProps
{
}




export class EnumInfo<
	TEnumType = unknown,
	F extends Object = {}
>
	extends Info<EnumInfoProps, F>
{

	constructor(
		public $enumType: TEnumType,
		props: EnumInfoProps | null | undefined,
		fields: F | null | undefined
	)
	{
		super(props, fields);
	}


	$itemsByValue: { [value: string]: EnumItemInfo } = {}
	//$itemsByName: { [value: number | string]: EnumItemInfo } = {}


	$item(value: number | string): EnumItemInfo | null
	{
		return this.$itemsByValue[value + ''] || null;
	}

}






export interface EnumItemInfoProps extends InfoProps
{
}




export class EnumItemInfo<
	TEnum extends EnumInfo = EnumInfo,
	TValue = number | string,
	F extends Object = {}
>
	extends Info<EnumItemInfoProps, F>
{

	constructor(
		public readonly $enum: TEnum,
		public readonly $value: TValue,
		props: EnumItemInfoProps | null | undefined,
		fields: F | null | undefined
	)
	{
		super(props, fields);

		$enum.$itemsByValue[$value + ''] = this as any;
	}



}
