import { useTheme } from "@mui/material/styles";
import type { ReactNode } from "react";
import { MuiColor, UseHookProps, useNew, Values } from "../core";
import { CaretBehavior } from "./ff.CaretBehavior";
import { Focuser } from "./ff.Focuser";






//===






export function Caret(props: Caret.Props)
{

	//return null;

	let bhv = useNew(CaretBehavior).use(props);


	return <div
		ref={bhv.setBodyEl}
		className="ff-caret-body"
		style={bhv.getStyle()}
		children={props.children && <div>{props.children}</div>}
	//children={<div>{bhv!.ff?.id}</div>}
	/>;


}






export module Caret
{


	//---




	export interface Props extends UseHookProps<Props>
	{

		debug?: boolean;

		color?: MuiColor;
		borderRadius?: BorderRadius;
		borderWidth?: BorderWidth;

		children?: ReactNode;

	}




	export type BorderRadius = (
		null /* 0 */ |
		undefined |
		"inherit" /* default */ |
		string |
		Values.Many<number | boolean>
	);


	export type BorderWidth = Values.Many<number | boolean>;







	//---




	//export var defaultBorderWidth = 2;
	export var defaultBorderRadius = "inherit";

	//export var bordererMask = ", 0 0 0 100vw rgba(0,16,32, 0.05)";
	export var bordererMask = "";


	export var defaultColor: MuiColor = "primary";




	//---




	export function LineIndicator1(props: {

		color?: MuiColor;
		height?: number;

		value: number;
		max: number;
		max2: number | null | undefined;

		disabled?: boolean;

	})
	{

		let theme = useTheme()
		let ff = Focuser.useCurrent();


		let color = (props.disabled || ff?.disabled
			? '80,80,80'
			: MuiColor.hex2rgb(MuiColor(theme, props.color || ff?.caret?.color || Caret.defaultColor))
		);


		let { value, max, max2 } = props;

		if (max2 == null)
			max2 = max;


		let hasMax2 = max2 > max;

		let f1 = Math.min(value, max) / (max + 1);

		let f2 = value <= max ? 0 : (
			Math.min(value - max - 1, max2 - max) / (max2 - max)
		);


		let w1 = hasMax2 ? 66 : 100;

		let leftPc = value <= max ? w1 * f1 : w1 + (100 - w1) * f2;
		let widthPc = Math.max(2, value <= max ? w1 / (max + 1) : (100 - w1) / (max2! - max));


		let left = `${Math.round(leftPc * 100) / 100}%`;

		if (value <= 0)
			left = `calc(${left} - 1px)`;


		let width = `${Math.round(widthPc * 100) / 100}%`;

		if (value >= max2)
			width = `calc(${width} + 1px)`;


		const height = props.height ?? 4;



		return <div className="ff-caret-lineBreak-indicator-1" style={{

			"--color": color,
			"--height": `${height}px`,
			"--left": left,
			"--width": width,

		} as any} />;


	}




	//---


}