import type { ReactNode } from "react";

import { alpha, styled, useTheme } from "@mui/material";

import { Focuser } from "./ff.Focuser";
import { currentFocuser } from "./ff.Core";
import { Values } from "../..";
import { $defaultAnimationDurationMs, $log, Div, MuiColor, UseHookProps, _$log, __$log, useNew } from "../core";
import { CaretBehavior } from "./ff.CaretBehavior";






//===






//export const $animationDurationMs = 1 * $defaultAnimationDurationMs;






//===






export function Caret(props: Caret.CaretProps)
{

	let theme = useTheme();

	let bhv = useNew(CaretBehavior).use(props);
	let ff = bhv.ff;

	if (!ff)
		return null;

	let inset = bhv.getInset();


	//__$log("Caret", bhv.id, inset);

	//$log("ff " + ff);


	let color = MuiColor(theme, bhv._priorColor || ff.color || Focuser.defaultColor)!;


	let borderRadius_ = bhv._priorBorderRadius ?? ff.borderRadius;

	let borderRadius = (
		borderRadius_ === undefined ? Caret.defaultBorderRadius :
			borderRadius_ === null ? `0` :
				borderRadius_ === "inherit" ? "inherit" :
					typeof borderRadius_ === "string" ? borderRadius_ :
						(Values
							.manyn(borderRadius_, a => a === undefined ? Caret.defaultBorderRadius : a === null ? "0" : `${a}px`)
							.join(" ")
						)
	);


	let borderWidth = (Values
		.manyn(bhv._priorBorderWidth ?? ff.borderWidth, a => a === undefined ? `${Caret.defaultBorderWidth}px` : a === null ? "0" : `${a}px`)
		.join(" ")
	);


	return <div

		ref={bhv.setBodyEl}

		className="ff-caret-body"

		style={{

			inset,

			...ff.isFocused && {
				opacity: 1,
				borderRadius,
				borderWidth,
			},

			"--color": hex2rgb(color),

			"--transition": bhv._priorPosition || bhv.ffIsPrior && currentFocuser()	? `none` : undefined,

		} as any}

		children={props.children && <div>{props.children}</div> || <div />}

	/>


	//return (

	//	<Caret.Body

	//		ref={bhv.setBodyEl}

	//		color={bhv._priorColor ?? ff.color}
	//		borderRadius={bhv._priorBorderRadius ?? ff.borderRadius}
	//		borderWidth={bhv._priorBorderWidth ?? ff.borderWidth}

	//		inset={bhv.getInset()}
	//		animation={!bhv._priorPosition && (!bhv.ffIsPrior || !currentFocuser())}
	//		opacity={ff.isFocused ? 1 : 0}

	//		children={props.children && <div>{props.children}</div>}

	//	/>

	//);


	function hex2rgb(hex: string)
	{
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);

		return `${r},${g},${b}`;
	}

}






export module Caret
{


	//---




	export const defaultBorderWidth = 2;
	export const defaultBorderRadius = "inherit";

	//export const bordererMask = ", 0 0 0 100vw rgba(0,16,32, 0.05)";
	export const bordererMask = "";



	//---




	export interface CaretProps extends UseHookProps<CaretProps>
	{

		color?: MuiColor;
		borderRadius?: Focuser.BorderRadius;
		borderWidth?: Focuser.BorderWidth;

		children?: ReactNode;

	}




	//---




	interface RootProps
	{
		color: MuiColor;
		borderRadius: Focuser.BorderRadius;
		borderWidth: Focuser.BorderWidth;

	}




	export const Body = styled(
		"div",
		{
			name: "focuser-caret-body",
			shouldForwardProp: p => p !== "color" && p !== "borderRadius" && p !== "borderWidth" && p !== "animation" && p !== "inset" && p !== "opacity"
		}
	)<
		RootProps & {
			padding?: number | [number, number, number, number];
			inset: string;
			animation?: boolean;
			opacity: number;
		}
	>(
		props =>
		{

			let color = MuiColor(props.theme, props.color || props.theme.palette.primary.main)!;


			let borderRadius_ = props.borderRadius;

			let borderRadius = (
				borderRadius_ === undefined ? defaultBorderRadius :
					borderRadius_ === null ? `0` :
						borderRadius_ === "inherit" ? "inherit" :
							typeof borderRadius_ === "string" ? borderRadius_ :
								(Values
									.manyn(borderRadius_, a => a === undefined ? defaultBorderRadius : a === null ? "0" : `${a}px`)
									.join(" ")
								)
			);


			let borderWidth = (Values
				.manyn(props.borderWidth, a => a === undefined ? `${defaultBorderWidth}px` : a === null ? "0" : `${a}px`)
				.join(" ")
			);


			//let margin = (Values
			//	.manyn(props.borderWidth, a => a === undefined ? `-${defaultBorderWidth}px` : a === null ? "0" : `-${a}px`)
			//	.join(" ")
			//);
			/*			let margin = " ";*/


			return {

				//position: "absolute",
				//zIndex: 999999,
				//pointerEvents: "none",

				inset: props.inset,
				opacity: props.opacity,
				color,

				borderColor: color,
				borderStyle: "solid",
				borderRadius,
				borderWidth,
				//margin,

				//boxShadow: `2px 2px 24px ${alpha(color, .4)}${bordererMask}`,
				//boxShadow: `0px 7px 8px -4px ${alpha(color, .2)}, 0px 12px 17px 2px ${alpha(color, .14)},0px 5px 22px 4px ${alpha(color, .12)}${bordererMask}`,
				boxShadow: `0px 7px 8px -4px ${alpha(color, .25)}, 0px 12px 17px 2px ${alpha(color, .18)}, 0px 5px 22px 4px ${alpha(color, .16)}${bordererMask}`,
				//boxShadow: `0px 7px 8px -4px ${alpha(color, .2)}, 0px 12px 17px 2px ${alpha(color, .14)}, 0px 5px 22px 4px ${alpha(color, .12)${bordererMask}`,

				transition: (!props.animation
					? `none`
					: `all ${$defaultAnimationDurationMs}ms linear, border ${$defaultAnimationDurationMs}ms linear, box-shadow ${$defaultAnimationDurationMs}ms linear`
				),


				//">div": {
				//	borderRadius: "inherit",
				//	//opacity: props.opacity,
				//	transition: `opacity ${$defaultAnimationDurationMs}ms linear`,
				//},

				//"&.shake-1": {
				//	animationDuration: ".5s",
				//	animationTimingFunction: "ease-in-out",
				//	animationName: "ff-shake-1",
				//},
				//"&.shake-2": {
				//	animationDuration: ".5s",
				//	animationTimingFunction: "ease-in-out",
				//	animationName: "ff-shake-2",
				//},
				//"&.shake-3": {
				//	animationDuration: ".5s",
				//	animationTimingFunction: "ease-in-out",
				//	animationName: "ff-shake-3",
				//},


				//"@keyframes ff-shake-1": {
				//	"0%": { transform: "translateY(0)" },
				//	"6.5%": { transform: "translateY(-2px) rotateY(-9deg)" },
				//	"18.5%": { transform: "translateY(2px) rotateY(7deg)" },
				//	"31.5%": { transform: "translateY(-1px) rotateY(-5deg)" },
				//	"43.5%": { transform: "translateY(1px) rotateY(3deg)" },
				//	"50%": { transform: "translateY(0)" },
				//},

				//"@keyframes ff-shake-2": {
				//	"0%": { transform: "translateX(0)" },
				//	"6.5%": { transform: "translateX(-6px) rotateY(-9deg)" },
				//	"18.5%": { transform: "translateX(5px) rotateY(7deg)" },
				//	"31.5%": { transform: "translateX(-3px) rotateY(-5deg)" },
				//	"43.5%": { transform: "translateX(2px) rotateY(3deg)" },
				//	"50%": { transform: "translateX(0)" },
				//},

				//"@keyframes ff-shake-3": {
				//	"0%": { transform: "skew(-10deg)" },
				//	"5%": { transform: "skewX(10deg)" },
				//	"10%": { transform: "skewX(-10deg)" },
				//	"15%": { transform: "skewX(10deg)" },
				//	"20%": { transform: "skewX(0deg)" },
				//	"100%": { transform: "skewX(0deg)" },
				//},

			};

		}
	);




	//---


}