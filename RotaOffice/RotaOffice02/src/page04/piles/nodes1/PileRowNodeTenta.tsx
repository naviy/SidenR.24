import { Focuser } from "@libs";
import { createRef } from "react";
import { Tenta } from "../../tentas";






//===






export class PileRowNodeTenta extends Tenta.Focusable(Tenta.Base)
{

	//---



	override use(cfg?: PileRowNodeTenta.UseConfig)
	{

		super.use(cfg);

		Tenta.Focusable.use(this, cfg);

		return this;

	}



	//---



	//declare onPhaseChanged?: (tenta: this) => void;


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

		if (this.phaseDown())
			return;


		if (await this.scrollIntoViewTop())
			return;


		if (await this.focusItems())
			return;


		await this.shake();

	}



	protected override async onLeftClick()
	{

		if (!this.focused)
		{
			await this.focus();
			return;
		}


		if (this.phaseDown())
			return;


		if (await this.scrollIntoViewTop())
			return;


		await this.shake();

	}



	override async onEnter()
	{

		if (this.phaseDown())
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



	override  async onLeftKey()
	{

		if (this.phaseUp())
		{
			/*await*/ this.scrollIntoView();
		}
		else
		{
			await this.focusParent() || await this.shake(3);
		}

	}



	override async onRightClick()
	{

		if (!this.focused)
		{
			await this.focus();
		}
		else if (this.phaseUp())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.unfocus();
		}

	}



	override async onExit()
	{

		if (this.phaseUp())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.unfocus();
		}

	}



	//---



	override async onCtrlLeftKey()
	{
		await this.parent?.focus();
	}

	override async onCtrlRightKey()
	{
		await this.onRightKey();
	}

	override async onCtrlUpKey()
	{
		await (this.priorSibling() || this.parent)?.focus();
	}

	override async onCtrlDownKey()
	{
		await (this.nextSibling() || this.next())?.focus();
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






export module PileRowNodeTenta
{


	export interface UseConfig extends Tenta.Base.UseConfig, Tenta.Focusable.UseConfig
	{
	}


}