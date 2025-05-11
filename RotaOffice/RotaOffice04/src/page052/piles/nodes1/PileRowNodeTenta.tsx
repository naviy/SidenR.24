import { ExpanderBaseBehavior, Focuser } from "@libs";
import { createRef, type RefObject } from "react";
import { Tenta } from "../../tentas";






//===






export class PileRowNodeTenta<
	TRestStateEx extends {} = {}
> extends Tenta.Focusable<TRestStateEx>
{

	//---



	override use(cfg?: PileRowNodeTenta.UseConfig)
	{

		if (cfg?.root)
			this.#rootFf = this.ff;


		super.use(cfg);


		//Tenta.Focusable.use(this, cfg);

		return this;

	}




	//---



	isRoot?: boolean;


	#rootFf?: Focuser | null;
	get rootFf() { return this.#rootFf || null };

	ff: Focuser | null = null;
	bodyFf: Focuser | null = null;
	tailFf: Focuser | null = null;

	get bodyIsFocused() { return !!this.bodyFf?.isFocused; }

	get tailFocused() { return !!this.tailFf?.isFocused; }

	tailExpanderRef = createRef<ExpanderBaseBehavior | null>();



	//---



	override created()
	{

		let { parentTenta } = this;


		if (this.#rootFf === undefined)
		{
			this.#rootFf = parentTenta instanceof PileRowNodeTenta ? parentTenta.#rootFf || null : null;
		}

	}



	//---



	override async focusBody(): Promise<Focuser | null>
	{
		return this.bodyFf && await this.bodyFf.focusIfCan();
	}


	unfocusBody()
	{
		this.bodyFf?.unfocus();
	}



	async shakeBody(mode?: 1 | 2 | 3)
	{
		await this.bodyFf?.caret?.shake(mode);
	}


	async focusTail(): Promise<Focuser | null>
	{
		return this.tailFf && await this.tailFf.enter();
	}


	unfocusTail()
	{
		this.tailFf?.unfocus();
	}


	async scrollIntoView(): Promise<boolean>
	{
		let { bodyFf } = this;
		return !!bodyFf && await bodyFf.scrollIntoView();
	}


	async scrollIntoViewTop(): Promise<boolean>
	{
		let { bodyFf } = this;
		return !!bodyFf && await bodyFf.scrollIntoViewTop({ topOffset: 80 });
	}



	//---



	override onTailDeseparated()
	{
		this.hasSeparatedItems && this.forEachTenta(a =>
			a.bodyDeseparate() || a.repaintNearests()
		);
	}


	override onItemBodySeparated()
	{
		this.tailSeparate();
	}



	//---



	toolsIsVisible = false;


	toggleTools()
	{
		this.toolsIsVisible = !this.toolsIsVisible;
		this.repaint();
	}



	//---



	protected override async onSpaceKey()
	{
		this.toggleTools()
	}



	//---



	protected override async onRightKey()
	{

		if (this.open())
			return;


		if (await this.scrollIntoViewTop())
			return;


		if (await this.focusTail())
			return;


		await this.shakeBody();

	}



	protected override async onLeftClick()
	{

		if (!this.bodyIsFocused)
		{
			await this.focusBody();
			return;
		}


		if (this.open())
			return;


		if (await this.scrollIntoViewTop())
			return;


		await this.shakeBody();

	}



	//---



	override  async onLeftKey()
	{

		if (this.close())
		{
			/*await*/ this.scrollIntoView();
		}
		//else if (!this.parentTenta?.goToStage(-1, a => !a.tailIsSeparated && a.stage !== "collapsed"))
		//{
		//	await this.focusParentBody() || await this.shakeBody(3);
		//}

	}



	override async onRightClick()
	{

		if (!this.bodyIsFocused)
		{
			await this.focusBody();
		}
		else if (this.close())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.unfocusBody();
		}

	}



	//---



	override async onEnter()
	{

		if (this.expand())
		{
			//await this.scrollIntoViewTop();
		}
		else
		{
			await this.scrollIntoViewTop();
			//await this.shakeBody();
			//	await this.focusItems();
		}

	}



	override async onExit()
	{

		if (this.collapse())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.unfocusBody();
		}

	}



	//---



	override async onCtrlLeftKey()
	{
		await this.parentTenta?.focusBody();
	}

	override async onCtrlRightKey()
	{
		await this.onRightKey();
	}

	override async onCtrlUpKey()
	{
		await (this.priorSibling() || this.parentTenta)?.focusBody();
	}

	override async onCtrlDownKey()
	{
		await (this.nextSibling() || this.next())?.focusBody();
	}



	//---

}






export module PileRowNodeTenta
{


	export interface UseConfig extends Tenta.Base.UseConfig, Tenta.Focusable.UseConfig
	{

		root?: boolean;

	}


}