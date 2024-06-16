import { Focuser } from "@libs";
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
			this.rootFfRef = this.ffRef;


		super.use(cfg);


		//Tenta.Focusable.use(this, cfg);

		return this;

	}




	//---



	isRoot?: boolean;



	rootFfRef?: RefObject<Focuser> | null;
	get rootFf(): Focuser | null { return this.rootFfRef?.current || null; }


	ffRef = createRef<Focuser>();
	get ff(): Focuser | null { return this.ffRef.current; }


	bodyFfRef = createRef<Focuser>();
	get bodyFf(): Focuser | null { return this.bodyFfRef.current; }
	get bodyIsFocused() { return !!this.bodyFf?.isFocused; }


	tailFfRef = createRef<Focuser>();
	get tailFf(): Focuser | null { return this.tailFfRef.current; }

	get tailFocused() { return !!this.tailFf?.isFocused; }



	//---



	override created()
	{

		let { parentTenta } = this;


		if (this.rootFfRef === undefined)
		{
			this.rootFfRef = parentTenta instanceof PileRowNodeTenta ? parentTenta.rootFfRef || null : null;
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
		return this.tailFfRef.current && await this.tailFfRef.current.enter();
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

			if (!this.closed && this.collapsed)
				this.expand();

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

		this.close();

		if (this.closed && !this.collapsed)
			this.collapse();

		this.scrollIntoView();

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
			if (this.expanded)
			{
				this.closed && this.open();
				await this.scrollIntoViewTop();
			}
		}
		else
		{
			!this.opened && this.open();
			await this.scrollIntoViewTop();
		}

	}



	override async onExit()
	{

		if (this.treeCollapse())
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