import { Focuser, Repaintable } from "@libs";
import { TentaFocusable } from "./TentaFocusable";
import { TentaPhaser } from "./TentaPhaser";
import { TentaBase } from "./TentaBase";
import { createRef, type RefObject } from "react";






//===






export interface TentaBehavior1UseConfig extends
	Repaintable.UseConfig,
	TentaBase.UseConfig,
	TentaPhaser.UseConfig,
	TentaFocusable.UseConfig
{
	//id: React.Key;
}




export class TentaBehavior1 extends
	TentaFocusable(
		TentaPhaser(
			TentaBase(
				Repaintable.Async()
			)
		)
	)
{

	//---



	use(cfg: TentaBehavior1UseConfig)
	{

		//this.id = cfg.id;

		Repaintable.use(this, cfg);
		TentaBase.use(this, cfg);
		TentaPhaser.use(this, cfg);
		TentaFocusable.use(this, cfg);


		return this;

	}



	//---



	declare onPhaseChanged?: (tenta: this) => void;


	rootFfRef = createRef<Focuser>();
	get rootFf(): Focuser | null { return this.rootFfRef.current; }

	itemsFfRef = createRef<Focuser>();
	get itemsFf(): Focuser | null { return this.itemsFfRef.current; }


	get itemsFocused() { return !!this.itemsFf?.isFocused; }



	//---



	async focusParent(): Promise<Focuser | null>
	{
		return this.rootFfRef.current && await this.rootFfRef.current.focusParentIfCan({ focusFirst: true });
	}



	async focusItems(): Promise<Focuser | null>
	{
		return this.itemsFfRef.current && await this.itemsFfRef.current.enter();
	}


	unfocusItems()
	{
		this.itemsFf?.unfocus();
	}



	//---



	protected override async onLeftClick()
	{

		if (!this.focused)
		{
			await this.focus();
		}

		else if (await this.expand())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.shake();
		}

	}


	protected override async onRightClick()
	{

		if (!this.focused)
		{
			await this.focus();
		}
		else if (await this.collapse())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.unfocus();
		}

	}



	override async onEnter()
	{

		if (await this.expand())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.shake();
			//	await this.focusItems();
		}

	}


	override async onExit()
	{

		if (await this.collapse())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.unfocus();
		}

	}



	protected override  async onLeftKey()
	{

		if (await this.collapse())
		{
			/*await*/ this.scrollIntoView();
		}
		else
		{
			await this.focusParent() || await this.shake(3);
		}

	}



	protected override async onRightKey()
	{

		if (await this.expand())
		{
			//if (this.opened /*&& await this.focusItems()*/)
			//{
			//await
			//}
		}
		else if (!await this.ff?.scrollIntoViewTop({ topOffset: 32}))
		{
			await this.focusItems() || await this.shake();
		}

	}



	//---



	//ff_onUnfocus(ff: Focuser, prior: Focuser, next: Focuser)
	//{

	//	if (this.expanded)
	//	{

	//		this.collapse();

	//		if (next?.listener instanceof TentaBehavior)
	//		{
	//			next.listener.expand();
	//		}

	//	}

	//}



	//---

}
