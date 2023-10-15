import { Repaintable } from "@libs";
import { TentaFocusable } from "./TentaFocusable";
import { TentaPhaser } from "./TentaPhaser";
import { TentaStatuser } from "./TentaStatuser";






//===





export interface TentaBehaviorUseConfig extends
	TentaFocusable.UseConfig,
	TentaPhaser.UseConfig,
	TentaStatuser.UseConfig,
	Repaintable.UseConfig
{
	//id: React.Key;
}




export class TentaBehavior extends TentaFocusable(TentaPhaser(TentaStatuser(Repaintable.Async())))
{

	//---


	use(cfg: TentaBehaviorUseConfig)
	{

		//this.id = cfg.id;

		Repaintable.use(this, cfg);
		TentaStatuser.use(this, cfg);
		TentaPhaser.use(this, cfg);
		TentaFocusable.use(this, cfg);


		return this;

	}


	//---


	//id!: React.Key;

	declare onPhaseChanged?: (tenta: this) => void;


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
			await this.shake(3);
			//await this.backToParent();
		}

	}



	protected override async onRightKey()
	{

		if (await this.expand())
		{
			//if (this.opened /*&& await this.focusItems()*/)
			//{
			//await
			this.scrollIntoView();
			//}
		}
		else
		{
			await this.shake();
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
