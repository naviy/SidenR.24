import { Repaintable } from "@libs";
import { TentaFocusable } from "./TentaFocusable";
import { TentaPhaser } from "./TentaPhaser";
import { TentaStatuser } from "./TentaStatuser";






//===






export class TentaBehavior extends TentaFocusable(TentaPhaser(TentaStatuser(Repaintable.Async())))
{

	//---



	use(cfg?:
		TentaFocusable.UseConfig &
		TentaPhaser.UseConfig &
		TentaStatuser.UseConfig &
		Repaintable.UseConfig
	)
	{

		Repaintable.use(this, cfg);
		TentaStatuser.use(this, cfg);
		TentaPhaser.use(this, cfg);
		TentaFocusable.use(this, cfg);

		return this;

	}



	//---


	onPhaseChanged?: (tenta: this) => void;


	//---



	protected async onLeftClick()
	{

		if (!this.focused)
		{
			await this.focus();
		}

		else if (await this.expand())
		{
			await this.scrollIntoView();
		}

	}


	protected async onRightClick()
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



	async onEnter()
	{

		if (await this.expand())
		{
			await this.scrollIntoView();
		}
		else
		{
			//	await this.focusItems();
		}

	}


	async onExit()
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



	protected async onLeftKey()
	{

		if (await this.collapse())
		{
			await this.scrollIntoView();
		}
		else
		{
			//await this.backToParent();
		}

	}



	protected async onRightKey()
	{

		this.expand();


		if (this.opened /*&& await this.focusItems()*/)
		{
			await this.scrollIntoView();
		}

	}



	//---



	//---

}
