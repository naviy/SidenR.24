import { useEffect } from "react";


import { Focuser, FocuserContext } from ".";
import { $error } from "../..";
import { MuiColor, Repaintable, UseHookProps } from "../core";
import { CaretProps } from "./ff.CaretProps";






//===






const zeroPadding = [0, 0, 0, 0];

let instanceCount = 0;






//===






export class CaretBehavior extends Repaintable.Async()
{

	//---



	static contextType = FocuserContext;

	context: Focuser | undefined;


	id = instanceCount++;



	//---



	props!: CaretProps;


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
	/*private*/ _priorColor?: MuiColor | null;
	/*private*/ _priorBorderRadius?: Focuser.BorderRadius;
	/*private*/ _priorBorderWidth?: Focuser.BorderWidth;



	//---



	use(props: CaretProps, cfg?: Repaintable.UseConfig)
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
