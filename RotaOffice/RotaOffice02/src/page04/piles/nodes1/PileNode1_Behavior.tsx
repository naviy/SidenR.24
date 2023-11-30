import { Focuser, Repaintable } from "@libs";
import { createRef } from "react";
import { Tenta } from "../../tentas";






//===






export interface PileNode1UseConfig extends
	Repaintable.UseConfig,
	Tenta.Base.UseConfig,
	Tenta.Focusable.UseConfig
{
}




export class PileNode1Behavior extends Tenta.Focusable(Tenta.Base)
{

	//---



	use(cfg: PileNode1UseConfig)
	{

		Repaintable.use(this, cfg);
		Tenta.Base.use(this, cfg);
		Tenta.Focusable.use(this, cfg);


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


	async scrollIntoView(): Promise<boolean>
	{
		let { ff } = this;
		return !!ff && await ff.scrollIntoView();
	}
	async scrollIntoViewTop(): Promise<boolean>
	{
		let { ff } = this;
		return !!ff && await ff.scrollIntoViewTop({ topOffset: 80 });
	}



	//---

	

	protected override async onRightKey()
	{

		if (await this.expand())
			return;


		if (this.parent && await this.parent.expand())
			return;


		if (await this.scrollIntoViewTop())
			return;


		if (await this.focusItems())
			return;


		await this.shake();

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
			await this.scrollIntoViewTop();
		}
		else
		{
			await this.shake();
			//	await this.focusItems();
		}

	}



	//---



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



	protected override async onLeftClick()
	{

		if (!this.focused)
		{
			await this.focus();
			return;
		}


		if (await this.expand())
			return;


		if (await this.scrollIntoViewTop())
			return;


		await this.shake();

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
