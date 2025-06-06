import { useEffect } from "react";
import { Keys, Repaintable } from "../core";
import { Focuser } from "../flow-focuser";
import type { RouteBehavior } from "./RouteBehavior";
import type { RouterBehavior } from "./RouterBehavior";






//===






export class RouteSelectorBehavior extends Repaintable()
{

	//---



	ff!: Focuser;


	router!: RouterBehavior;
	selectedRoute?: RouteBehavior | null;

	visible = false;
	nextIndex: number = 0;
	pageActivated?: boolean;
	showTimerId: number | null = null;



	//---



	use(cfg: Repaintable.UseConfig & {
		router: RouterBehavior;
		ff: Focuser.Props;
	})
	{

		Repaintable.use(this, cfg);


		this.router = cfg.router;

		this.nextIndex = Math.min(this.nextIndex || 1, this.router.routes.length - 1);


		this.ff = Focuser.use(cfg.ff);


		useEffect(() =>
		{

			document.addEventListener('keydown', this.onKeyDown);
			document.addEventListener('keyup', this.onKeyUp);

			return () =>
			{
				document.removeEventListener('keydown', this.onKeyDown);
				document.removeEventListener('keyup', this.onKeyUp);
			};

		}, []);


		return this;

	}




	//---



	selectRoute(route: RouteBehavior)
	{
		this.selectedRoute = route;
	}



	//@$logm
	show()
	{

		if (this.visible)
		{
			this.#selectNextRouteLink();
		}

		else if (!this.showTimerId)
		{
			this.#startShowing();
		}

		else
		{
			this.#forceShowing();
		}

	}



	#selectNextRouteLink()
	{
		let ff = Focuser.current();

		let ff2 = ff && (ff.nextSibling() || ff.firstSibling());

		ff2?.focus();
	}


	#startShowing()
	{

		this.selectedRoute = null;
		this.nextIndex = 1;


		this.showTimerId = window.setTimeout(() =>
		{
			this.visible = true;
			this.repaint();

			this.showTimerId = null;

		}, 300);

	}


	#forceShowing()
	{

		this.nextIndex++;


		if (this.showTimerId)
		{
			clearTimeout(this.showTimerId);
			this.showTimerId = null;
		}


		this.visible = true;
		this.repaint();

	}



	//@$logm
	hide = async () =>
	{

		if (this.showTimerId)
		{

			clearTimeout(this.showTimerId);
			this.showTimerId = null;

			await this.activateSelectedRoute();

		}

		else //if (this.visible)
		{

			this.visible = false;
			await this.repaint();

			if (!this.pageActivated)
				await this.activateSelectedRoute();

		}

	}



	//---



	//@$logm
	async activateSelectedRoute()
	{

		let selectedRoute = this.selectedRoute || this.router.routesByActivateTime[this.nextIndex];
		this.selectedRoute = null;


		if (!selectedRoute)
			return;


		this.ff.beginDelete();

		try
		{
			await selectedRoute.activate();
		}
		catch (ex)
		{
			this.ff.beginDelete();
			throw ex;
		}

	}



	//@$logm
	async activateNextRoute(offset: number)
	{

		let nextRoute = this.router.getNextRoute(offset);

		nextRoute && await nextRoute.activate();

	}



	//---



	onKeyDown = (e: KeyboardEvent) =>
	{

		this.pageActivated = false;


		if (!(!e.ctrlKey && !e.altKey && e.shiftKey))
			return;


		if (e.key === Keys.Tab)
		{

			e.preventDefault();
			e.stopPropagation();

			this.show();

		}

		else if (e.key === Keys.PageUp)
		{

			e.preventDefault();
			e.stopPropagation();

			this.pageActivated = true;
			this.activateNextRoute(-1);

		}

		else if (e.key === Keys.PageDown)
		{

			e.preventDefault();
			e.stopPropagation();

			this.pageActivated = true;
			this.activateNextRoute(1);

		}

	}



	onKeyUp = (e: KeyboardEvent) =>
	{

		if ((this.visible || this.showTimerId) && !e.ctrlKey && !e.altKey && e.key === Keys.Shift)
		{

			e.preventDefault();
			e.stopPropagation();

			this.hide();

		}

	}



	//---

}

