import { Block } from "./Block";






//===





export type ContainerLayout = "row" | "col";

export type PaneBorder = 0 | 1 | 2;





export interface ContainerProps<P extends ContainerProps = any> extends Block.Props//, ExpanderBaseProps, UseHookProps<P>
{

	id?: string;
	debug?: boolean;

	layout?: ContainerLayout;

	borderOn?: PaneBorder;
	borderOff?: PaneBorder;

	radius?: PaneRadius;

	wrapperCls?: string | null;

}




export module ContainerProps
{


	export const propNames_: Record<keyof ContainerProps, true> =
	{

		id: true,
		debug: true,
		layout: true,

		borderOn: true,
		borderOff: true,

		radius: true,

		wrapperCls: true,

		...Block.propNames_,
		//...ExpanderBaseProps.propNames_,
		//...UseHookProps.propNames_,

	};



	export const propNames = Object.keys(propNames_) as (keyof ContainerProps)[];



}






//===






export type PaneRadius = 0 | 1 | 2;



export module PaneRadius
{

	export function toPx(r: PaneRadius)
	{
		return r === 1 ? 6 : r === 2 ? 12 : 0;
	}

	export function toCss(
		rOff: PaneRadius,
		rOn: PaneRadius,
		rtl: boolean | undefined,
		rtr: boolean | undefined,
		rbr: boolean | undefined,
		rbl: boolean | undefined
	)
	{
		return `${toPx(rtl ? rOn : rOff)}px ${toPx(rtr ? rOn : rOff)}px ${toPx(rbr ? rOn : rOff)}px ${toPx(rbl ? rOn : rOff)}px`;
	}

}