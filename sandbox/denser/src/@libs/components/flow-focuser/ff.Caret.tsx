import { Component, ReactNode } from "react";

import { alpha, styled } from "@mui/material";

import { $defaultAnimationDurationMs, $logm, MuiColor } from "../core";
//**import { bordererMask } from ".";
import { currentFocuser, Focuser, FocuserContext } from ".";
import { $error, Values } from "../..";






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

			"&.shake": {
				animationDuration: ".5s",
				animationTimingFunction: "ease-in-out",
				animationName: "ff-shake",
			},


			"@keyframes ff-shake": {
				"0%": {
					transform: "translateX(0)"
				},

				"6.5%": {
					transform: "translateX(-6px) rotateY(-9deg)"
				},

				"18.5%": {
					transform: "translateX(5px) rotateY(7deg)"
				},

				"31.5%": {
					transform: "translateX(-3px) rotateY(-5deg)"
				},

				"43.5%": {
					transform: "translateX(2px) rotateY(3deg)"
				},

				"50%": {
					transform: "translateX(0)"
				}
			}

		};

	}
);






export class Caret extends Component<{ children?: ReactNode }>
{

	//---



	static contextType = FocuserContext;

	context: Focuser | undefined;


	private static _instanceCount = 0;
	id: number = Caret._instanceCount++;



	//---



	get ff(): Focuser | null
	{

		let ff = this._ff;


		if (ff === undefined)
		{
			ff = this.context;

			while (ff && ff.props.noCaret)
			{
				ff = ff.parent;
			}

			this._ff = ff = ff || null;
		}


		return ff;
	}

	private _ff?: Focuser | null;


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
	private _priorPosition?: DOMRect | null;
	//private _priorPadding?: [number, number, number, number] | null;
	private _priorBorderRadius?: Focuser.BorderRadius;
	private _priorBorderWidth?: Focuser.BorderWidth;


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
	update(prior: Focuser | null)
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
			this._priorBorderRadius = prior?.props.borderRadius;
			this._priorBorderWidth = prior?.props.borderWidth;

			//this._priorPadding = this.ffIsPrior ? null : prior?.safePadding();
			//$log("this._priorPosition:", this._priorPosition);


			if (!this._priorPosition)
			{
				this.forceUpdate();
			}

			else
			{

				this.forceUpdate(() =>
				{
					this._priorPosition = null;
					this._priorBorderRadius = null;
					this._priorBorderWidth = null;

					this.forceUpdate();
				});

			}

		}

		else if (this.ffIsPrior)
		{

			this._priorPosition = null;
			this.forceUpdate();

		}

	}



	//---



	async shake()
	{

		let el = this.el!;
		if (!el) return;

		el.classList.remove('shake'); // reset animation
		void el.offsetWidth; // trigger reflow
		el.classList.add('shake'); // start animation

	}



	//---



	componentDidMount()
	{
		this.ff?.registerCaret(this);
	}



	componentWillUnmount()
	{
		this.ff?.removeCaret(this);
	}



	render()
	{

		let ff = this.ff;

		if (!ff)
			return null;


		//$log("ff.isFocused:", ff.isFocused);
		//$log("this.getInset():", this.getInset());


		return <CaretBody

			ref={this.setEl}

			className="focuser-caret-body"

			color={ff.color}

			borderRadius={this._priorBorderRadius ?? ff.props.borderRadius}
			borderWidth={this._priorBorderWidth ?? ff.props.borderWidth}

			inset={this.getInset()}
			animation={!this._priorPosition && (!this.ffIsPrior || !currentFocuser())}
			opacity={ff.isFocused ? 1 : 0}

			children={<div>{this.props.children}</div>}

		/>;

	}



	//---

}
