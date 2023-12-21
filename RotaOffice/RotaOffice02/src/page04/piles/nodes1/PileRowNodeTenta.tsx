import { ExpanderBaseBehavior, Focuser } from "@libs";
import { createRef } from "react";
import { Tenta } from "../../tentas";






//===






export class PileRowNodeTenta extends Tenta.Focusable(Tenta.Base)
{

	//---



	//constructor(id: React.Key)
	//{
	//	super(id);

	//}


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


	tailFfRef = createRef<Focuser>();
	get tailFf(): Focuser | null { return this.tailFfRef.current; }

	get tailFocused() { return !!this.tailFf?.isFocused; }

	tailExpanderRef = createRef<ExpanderBaseBehavior | null>();



	//---



	async focusParent(): Promise<Focuser | null>
	{
		return this.rootFfRef.current && await this.rootFfRef.current.focusParentIfCan({ focusFirst: true });
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


		if (await this.focusTail())
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