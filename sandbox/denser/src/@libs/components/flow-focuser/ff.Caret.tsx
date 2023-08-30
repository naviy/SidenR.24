import { ReactNode, useEffect } from "react";

import { alpha, styled } from "@mui/material";

import { Focuser, FocuserContext, currentFocuser } from ".";
import { $error, Values } from "../..";
import { $defaultAnimationDurationMs, MuiColor, Repaintable, UseHookProps, useNew } from "../core";






//===






export const $animationDurationMs = 1 * $defaultAnimationDurationMs;



//export const bordererMask = ", 0 0 0 100vw rgba(0,16,32, 0.05)";
export const bordererMask = "";

const defaultBorderWidth = 2;
const defaultBorderRadius = "inherit";



const zeroPadding = [0, 0, 0, 0];




//===






interface CaretRootProps
{
	color: MuiColor;

	borderRadius: Focuser.BorderRadius;
	borderWidth: Focuser.BorderWidth;

}






const CaretBody = styled(
	"div",
	{
		name: "focuser-caret-body",
		shouldForwardProp: p => p !== "color" && p !== "borderRadius" && p !== "borderWidth" && p !== "animation" && p !== "inset" && p !== "opacity"
	}
)<
	CaretRootProps & {
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
		let margin = " ";


		return {

			position: "absolute",
			inset: props.inset,
			zIndex: 999999,
			pointerEvents: "none",

			opacity: props.opacity,
			color,

			borderColor: color,
			borderStyle: "solid",
			borderRadius,
			borderWidth,
			margin,

			//boxShadow: `2px 2px 24px ${alpha(color, .4)}${bordererMask}`,
			//boxShadow: `0px 7px 8px -4px ${alpha(color, .2)}, 0px 12px 17px 2px ${alpha(color, .14)},0px 5px 22px 4px ${alpha(color, .12)}${bordererMask}`,
			boxShadow: `0px 7px 8px -4px ${alpha(color, .25)}, 0px 12px 17px 2px ${alpha(color, .18)}, 0px 5px 22px 4px ${alpha(color, .16)}${bordererMask}`,
			//boxShadow: `0px 7px 8px -4px ${alpha(color, .2)}, 0px 12px 17px 2px ${alpha(color, .14)}, 0px 5px 22px 4px ${alpha(color, .12)${bordererMask}`,

			transition: (!props.animation
				? `none`
				: `all ${$animationDurationMs}ms ease-out, border ${$animationDurationMs}ms linear, box-shadow ${$animationDurationMs}ms linear`
			),


			">div": {
				borderRadius: "inherit",
				//opacity: props.opacity,
				transition: `opacity ${$animationDurationMs}ms linear`,
			},

			"&.shake-1": {
				animationDuration: ".5s",
				animationTimingFunction: "ease-in-out",
				animationName: "ff-shake-1",
			},
			"&.shake-2": {
				animationDuration: ".5s",
				animationTimingFunction: "ease-in-out",
				animationName: "ff-shake-2",
			},
			"&.shake-3": {
				animationDuration: ".5s",
				animationTimingFunction: "ease-in-out",
				animationName: "ff-shake-3",
			},


			"@keyframes ff-shake-1": {
				"0%": { transform: "translateY(0)" },
				"6.5%": { transform: "translateY(-2px) rotateY(-9deg)" },
				"18.5%": { transform: "translateY(2px) rotateY(7deg)" },
				"31.5%": { transform: "translateY(-1px) rotateY(-5deg)" },
				"43.5%": { transform: "translateY(1px) rotateY(3deg)" },
				"50%": { transform: "translateY(0)" },
			},

			"@keyframes ff-shake-2": {
				"0%": { transform: "translateX(0)" },
				"6.5%": { transform: "translateX(-6px) rotateY(-9deg)" },
				"18.5%": { transform: "translateX(5px) rotateY(7deg)" },
				"31.5%": { transform: "translateX(-3px) rotateY(-5deg)" },
				"43.5%": { transform: "translateX(2px) rotateY(3deg)" },
				"50%": { transform: "translateX(0)" },
			},

			"@keyframes ff-shake-3": {
				"0%": { transform: "skew(-10deg)" },
				"5%": { transform: "skewX(10deg)" },
				"10%": { transform: "skewX(-10deg)" },
				"15%": { transform: "skewX(10deg)" },
				"20%": { transform: "skewX(0deg)" },
				"100%": { transform: "skewX(0deg)" },
			},

		};

	}
);






export function Caret(props: Caret.Props)
{

	let bhv = useNew(CaretBehavior).use(props);

	let ff = bhv.ff;
	if (!ff) return null;


	return <CaretBody

		ref={bhv.setEl}

		className="focuser-caret-body"

		color={bhv._priorColor ?? ff.color}
		borderRadius={bhv._priorBorderRadius ?? ff.borderRadius}
		borderWidth={bhv._priorBorderWidth ?? ff.borderWidth}

		inset={bhv.getInset()}
		animation={!bhv._priorPosition && (!bhv.ffIsPrior || !currentFocuser())}
		opacity={ff.isFocused ? 1 : 0}

		children={<div>{props.children}</div>}

	/>;
}




export module Caret
{

	//---



	export interface Props extends UseHookProps<Props>
	{

		color?: MuiColor;
		borderRadius?: Focuser.BorderRadius;
		borderWidth?: Focuser.BorderWidth;

		children?: ReactNode;

	}



	//---



	let instanceCount = 0;


	export function newId()
	{
		return instanceCount++;
	}



	//---

}




export class CaretBehavior extends Repaintable.Async()
{

	//---



	static contextType = FocuserContext;

	context: Focuser | undefined;


	id: number = Caret.newId();



	//---


	props!: Caret.Props;


	ff?: Focuser | null;

	ffIsPrior?: boolean;


	el?: HTMLDivElement;

	setEl = (el: HTMLDivElement) =>
	{

		if (this.el && !el)
			this.recalcPosition();

		this.el = el;

		if (this.el)
			this.recalcPosition();
	};



	private _position?: DOMRect | null;
	/*private*/ _priorPosition?: DOMRect | null;
	//private _priorPadding?: [number, number, number, number] | null;
	/*private*/ _priorColor?: MuiColor | null;
	/*private*/ _priorBorderRadius?: Focuser.BorderRadius;
	/*private*/ _priorBorderWidth?: Focuser.BorderWidth;



	//---



	use(props: Caret.Props, cfg?: Repaintable.UseConfig)
	{

		this.props = UseHookProps.use(props);


		Repaintable.use(this, cfg);


		let ff = Focuser.use();

		while (ff && ff.props.noCaret)
		{
			ff = ff.parent || null;
		}

		this.ff = ff || null;


		useEffect(() =>
		{
			ff?.registerCaret(this);
			return () => ff?.removeCaret(this);
		});


		return this;

	}



	//---



	toString()
	{
		return `Caret[${this.id}]`;
	}



	toLogValue()
	{
		if (!this.el)
			return [this.toString()];

		return [this.toString(), this.el];
	}



	//---



	//@$logm
	recalcPosition(force?: boolean)
	{

		let el = this.el;
		//$log("el:", el);
		if (el)
		{
			this._position = el.getBoundingClientRect();
		}
		else if (force)
		{
			this._position = null;
		}


		return this._position;

	}



	getInset(): string
	{

		let p = this.recalcPosition();
		let pp = this._priorPosition;

		let pd = this.ff?.safePadding() ?? zeroPadding;


		if (p && pp)
			return `${pp.top - p.top + pd[0]}px ${p.left + p.width - pp.left - pp.width + pd[1]}px ${p.top + p.height - pp.top - pp.height + pd[2]}px ${pp.left - p.left + pd[3]}px`;


		return `${pd[0]}px ${pd[1]}px ${pd[2]}px ${pd[3]}px`;

	}



	//---



	//@$logm
	async update(prior: Focuser | null)
	{

		let ff = this.ff;


		this.ffIsPrior = ff! === prior;
		//$log("prior.caret:", prior?.caret);
		//$log("prior.caret.el:", prior?.caret.el);
		//$log("ffIsPrior:", this.ffIsPrior);


		if (!ff)
			return;



		if (ff.isFocused)
		{

			if (prior && !prior.caret)
			{
				$error(`prior && !prior.caret`);
			}



			if (this.ffIsPrior)
				prior = null;

			this._priorPosition = prior?.caret?.recalcPosition();
			this._priorColor = prior?.color;
			this._priorBorderRadius = prior?.borderRadius;
			this._priorBorderWidth = prior?.borderWidth;

			//this._priorPadding = this.ffIsPrior ? null : prior?.safePadding();
			//$log("this._priorPosition:", this._priorPosition);


			if (!this._priorPosition)
			{
				this.repaint();
			}

			else
			{

				await this.repaint();

				this._priorPosition = null;
				this._priorColor = null;
				this._priorBorderRadius = null;
				this._priorBorderWidth = null;

				this.repaint();

			}

		}

		else if (this.ffIsPrior)
		{

			this._priorPosition = null;
			this.repaint();

		}

	}



	//---



	async shake(mode?: 1 | 2 | 3)
	{

		let el = this.el!;
		if (!el) return;

		el.classList.remove('shake-1', 'shake-2', 'shake-3');
		void el.offsetWidth; // trigger reflow
		el.classList.add(`shake-${mode || 1}`);

	}



	//---

}
