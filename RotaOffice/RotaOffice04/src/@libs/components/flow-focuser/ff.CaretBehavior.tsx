import { useTheme, type Theme } from "@mui/material/styles";
import { useEffect, type CSSProperties } from "react";
import { $log, MuiColor, Repaintable, UseHookProps, Values } from "../core";
import { Caret } from "./ff.Caret";
import { currentFocuser } from "./ff.Core";
import { Focuser } from "./ff.Focuser";






//===






const zeroPadding = [0, 0, 0, 0];

let instanceCount = 0;






//===






export class CaretBehavior extends Repaintable()
{

	//---



	//static contextType = Focuser.Context;

	//context: Focuser | undefined;


	id = instanceCount++;



	//---



	props!: Caret.Props;

	theme!: Theme;
	ff?: Focuser | null;

	ffIsPrior?: boolean;


	bodyEl?: HTMLDivElement;

	setBodyEl = (el: HTMLDivElement) =>
	{

		if (this.bodyEl && !el)
			this.recalcPosition();

		this.bodyEl = el;

		if (this.bodyEl)
			this.recalcPosition();
	};


	get color() { return this.props.color ?? this.ff?.props.color ?? Caret.defaultColor; }
	get borderRadius() { return this.props.borderRadius ?? this.ff?.props.borderRadius; }
	get borderWidth() { return this.props.borderWidth ?? this.ff?.props.borderWidth; }



	private _position?: DOMRect | null;
	/*private*/ _priorPosition?: DOMRect | null;
	/*private*/ _priorColor?: MuiColor | null;
	/*private*/ _priorBorderRadius?: Caret.BorderRadius;
	/*private*/ _priorBorderWidth?: Caret.BorderWidth;



	//---



	use(props: Caret.Props, cfg?: Repaintable.UseConfig)
	{

		this.props = UseHookProps.use(props);


		Repaintable.use(this, cfg);


		this.theme = useTheme();


		let ff = Focuser.useContext();

		while (ff && ff.props.noCaret)
		{
			ff = ff.parent || null;
		}

		this.ff = ff || null;


		useEffect(() =>
		{
			ff?.registerCaret(this);
			return () => ff?.unregisterCaret(this);
		});


		return this;

	}



	//---



	override toString()
	{
		return `Caret[${this.id}]`;
	}



	toLogValue()
	{
		if (!this.bodyEl)
			return [this.toString()];

		return [this.toString(), this.bodyEl];
	}



	//---



	//@$logm
	recalcPosition(force?: boolean)
	{

		let el = this.bodyEl;
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



	//@$log.m
	getInset(): string
	{

		let p = this.recalcPosition();
		let pp = this._priorPosition;

		let pd = this.ff?.safePadding() ?? zeroPadding;

		//$log("p:", p)
		//$log("pp:", pp)
		//$log("pd:", pd)

		if (p && pp)
		{
			return `${pp.top - p.top + pd[0]}px ${p.left + p.width - pp.left - pp.width + pd[1]}px ${p.top + p.height - pp.top - pp.height + pd[2]}px ${pp.left - p.left + pd[3]}px`;
		}


		return `${pd[0]}px ${pd[1]}px ${pd[2]}px ${pd[3]}px`;

	}



	//@$log.m
	getStyle(): CSSProperties | undefined
	{

		let ff = this.ff;
		if (!ff)
			return undefined;


		let color = MuiColor(this.theme, this._priorColor || this.color || Caret.defaultColor)!;

		let inset = this.getInset();
		//$log("inset:", inset);


		let borderRadius_ = this._priorBorderRadius ?? this.borderRadius;

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
			.manyn(
				this._priorBorderWidth ?? this.borderWidth,
				a => a === undefined ? undefined /*`${Caret.defaultBorderWidth}px`*/ : a === null ? "0" : `${a}px`
			)
			.join(" ")
		);


		let focused = ff.isFocused;


		return {

			inset: inset !== "0px 0px 0px 0px" ? inset : undefined,
			"--opacity": focused || this.props.debug ? 1 : undefined,
			borderRadius: focused ? borderRadius : undefined,
			borderWidth: focused ? borderWidth : this.props.debug ? 1 : undefined,

			"--color": MuiColor.hex2rgb(color),

			"--transition": this._priorPosition || this.ffIsPrior && currentFocuser() ? `none` : undefined,

		} as CSSProperties;


	}


	//async #updateBody()
	//{
	//	await arequestAnimationFrame(() =>
	//	{

	//		let style = this.bodyEl?.style;
	//		let newStyle = this.getStyle();

	//		if (!style || !newStyle)
	//			return;


	//		for (let p in newStyle)
	//		{

	//			let value = (newStyle as any)[p];

	//			if (value === undefined)
	//				style.removeProperty(p);
	//			else
	//				style.setProperty(p, value);
	//		}

	//	});
	//}



	//---



	//@$log.m
	update(prior: Focuser | null, mustRepaint: boolean)
	{

		//$log("prior:", prior);

		//__$log("UPDATE " + this);

		let ff = this.ff;


		this.ffIsPrior = ff! === prior;
		//$log("prior.caret:", prior?.caret);
		//$log("prior.caret.el:", prior?.caret.el);
		//$log("ffIsPrior:", this.ffIsPrior);


		if (!ff)
			return;


		if (ff!.isFocused)
		{

			if (prior && !prior!.caret)
			{
				$log.error(`prior && !prior.caret`);
			}


			if (this.ffIsPrior)
				prior = null;



			this.#assignPriorProps(prior?.caret);


			if (!this._priorPosition)
			{
				mustRepaint && this.repaint();
			}

			else
			{

				////mustRepaint && await this.#updateBody();
				mustRepaint && this.repaint();
				////await adelay(0);


				window.setTimeout(() =>
				{
					this.#assignPriorProps(null);
					mustRepaint && this.repaint();
				}, 1);
				////mustRepaint && await this.#updateBody();

			}
		}

		else if (this.ffIsPrior)
		{

			this.#assignPriorProps(null);
			mustRepaint && this.repaint();
			//mustRepaint && await this.#updateBody();

		}

	}



	//@$log.m
	#assignPriorProps(prior: CaretBehavior | null | undefined)
	{
		this._priorPosition = prior?.recalcPosition();
		//$log("priorPosition:", this._priorPosition);
		this._priorColor = prior?.color;
		this._priorBorderRadius = prior?.borderRadius;
		this._priorBorderWidth = prior?.borderWidth;
	}



	//---



	async shake(mode?: 1 | 2 | 3)
	{

		let el = this.bodyEl!;
		if (!el) return;

		el.classList.remove('shake-1', 'shake-2', 'shake-3');
		void el.offsetWidth; // trigger reflow
		el.classList.add(`shake-${mode || 1}`);

	}



	//---

}




//===




//function diffParents(el1: HTMLElement | null | undefined, el2: HTMLElement | null | undefined)
//{

//	let parents1 = allParentsAndMe(el1);
//	let parents2: HTMLElement[] = [];

//	let el = el2;


//	while (el)
//	{

//		let i = parents1.indexOf(el);

//		if (i >= 0)
//			return parents2;

//		parents2.push(el);
//		el = el.parentElement;

//	}


//	return null; // Если общего родителя не найдено


//	function allParentsAndMe(el: HTMLElement | null | undefined)
//	{
//		let parents: HTMLElement[] = [];

//		while (el)
//		{
//			parents.push(el);
//			el = el.parentElement;
//		}

//		return parents;
//	}

//}