import { ExpanderBaseBehavior, Focuser, __$log, ___$log } from "@libs";
import { createRef, type RefObject } from "react";
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

		if (cfg?.root)
			this.rootFfRef = this.ffRef;


		super.use(cfg);


		Tenta.Focusable.use(this, cfg);

		return this;

	}




	//---



	//declare onPhaseChanged?: (tenta: this) => void;


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

	tailExpanderRef = createRef<ExpanderBaseBehavior | null>();



	//---



	override created()
	{

		let { parent } = this;


		if (this.rootFfRef === undefined)
		{
			this.rootFfRef = parent instanceof PileRowNodeTenta ? parent.rootFfRef || null : null;
		}

	}



	//---



	async focusParent(): Promise<Focuser | null>
	{
		return this.ffRef.current && await this.ffRef.current.focusParentIfCan({ focusFirst: true });
	}



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



	override bodySeparate()
	{
		return this.goToStage(+1, a => a.bodyIsSeparated);
	}

	override tailSeparate()
	{
		return this.goToStage(+1, a => a.tailIsSeparated);
	}

	override bodyDeseparate()
	{
		return this.goToStage(-1, a => !a.bodyIsSeparated);
	}

	override tailDeseparate()
	{
		return this.goToStage(-1, a => !a.tailIsSeparated);
	}



	override onTailDeseparated()
	{
		this.hasSeparatedItems && this.forEachTenta(a =>
			a.bodyDeseparate() || a.repaintNearests()
		);
	}


	override onItemSeparated()
	{
		this.tailSeparate();
	}


	override onItemDeseparated()
	{
		//!this.hasSeparatedItems && this.tailDeseparate();
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

		if (this.incPhase())
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


		if (this.incPhase())
			return;


		if (await this.scrollIntoViewTop())
			return;


		await this.shakeBody();

	}



	override async onEnter()
	{

		if (this.incPhase())
		{
			await this.scrollIntoViewTop();
		}
		else
		{
			await this.shakeBody();
			//	await this.focusItems();
		}

	}



	//---



	override  async onLeftKey()
	{

		if (this.decPhase())
		{
			/*await*/ this.scrollIntoView();
		}
		else if (!this.parent?.tailDeseparate())
		{
			await this.focusParent() || await this.shakeBody(3);
		}

	}



	override async onRightClick()
	{

		if (!this.bodyIsFocused)
		{
			await this.focusBody();
		}
		else if (this.decPhase())
		{
			await this.scrollIntoView();
		}
		else
		{
			await this.unfocusBody();
		}

	}



	override async onExit()
	{

		if (this.decPhase())
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
		await this.parent?.focusBody();
	}

	override async onCtrlRightKey()
	{
		await this.onRightKey();
	}

	override async onCtrlUpKey()
	{
		await (this.priorSibling() || this.parent)?.focusBody();
	}

	override async onCtrlDownKey()
	{
		await (this.nextSibling() || this.next())?.focusBody();
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

		root?: boolean;

	}


}