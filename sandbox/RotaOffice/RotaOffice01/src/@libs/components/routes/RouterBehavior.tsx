import _ from "lodash";
import { Repaintable, Values, useNew } from "../core";
import type { RouteBehavior } from "./RouteBehavior";
import * as Route from "./Route";






//===






export function useRouterBehavior(props?: RouterBehaviorProps): RouterBehavior
{
	return useNew(RouterBehavior).use(props);
}






//===






export interface RouterBehaviorProps
{

	//ref?: React.MutableRefObject<RouterBehavior>,

	routes?: Values.Many<RouteBehavior | false | 0>,

	//forceUpdate?: () => void,

	defaultActiveKey?: string | null,
	activeKey?: string | null | ((router: RouterBehavior) => string | null | undefined),


	onActivating?: (route: RouteBehavior | null) => Promise<string | null | undefined | void> | string | null | undefined | void;

}






export class RouterBehavior extends Repaintable()
{

	//---



	static instanceCount = 0;
	iid = `router#${RouterBehavior.instanceCount++}`;


	props!: RouterBehaviorProps;


	parentRoute: RouteBehavior | null = null;

	//parentState!: RouteState | null;


	routes: RouteBehavior[] = [];
	private _routesIsChanged?: boolean;


	get routesByActivateTime(): RouteBehavior[]
	{

		if (this._routesIsChanged || !this._routesByActivateTime)
		{
			let minDate = new Date(-8640000000000000); //min date
			this._routesByActivateTime = _.orderBy(this.routes, a => a.lastActivateTime || minDate, "desc");
		}


		return this._routesByActivateTime;

	}
	private _routesByActivateTime?: RouteBehavior[];


	private _activeRoute: RouteBehavior | null = null;
	get activeRoute() { return this._activeRoute; }


	private _activeKey?: string | null;
	get activeKey(): string | null | undefined { return this._activeKey; }


	private _priorKey?: string | null;
	get priorKey(): string | null { return this._priorKey || null; }


	private _defaultActiveKey?: string | null;
	get defaultActiveKey() { return this._defaultActiveKey; }



	//---



	use(props?: RouterBehaviorProps, cfg?: Repaintable.UseConfig)
	{

		Repaintable.use(this, cfg);


		this.props = props || {};
		

		this.parentRoute = Route.use();


		if (!props)
			return this;


		//if (props.ref)
		//	props.ref.current = this;


		if (props.routes !== undefined && !this.routes.length)
		{

			//$log("props.routes:", props.routes);
			//$log("Values.many(props.routes):", Values.many(props.routes));

			this.routes.push(...Values.many(props.routes) as any[]);

			if (this._activeKey === undefined && props.activeKey === undefined)
			{
				this.setActiveKey(this.routes[0].key);
				//$log("this._activeKey:", this._activeKey);
			}

		}


		if (props.activeKey !== undefined)
		{

			let activeKey = typeof props.activeKey === "function" ? props.activeKey(this) : props.activeKey;

			this.setActiveKey(activeKey);

		}


		if (props.defaultActiveKey !== undefined)
		{
			this._defaultActiveKey = props.defaultActiveKey;
		}


		return this;

	}



	//---



	register(route: RouteBehavior): boolean
	{

		let result = this.routes.register(route);

		if (result)
			this._routesIsChanged = true;

		return result;

	}


	unregister(route: RouteBehavior): boolean
	{

		let result = this.routes.remove(route);

		if (result)
			this._routesIsChanged = true;

		return result;

	}



	//---



	indexOfKey(routeKey: string | null | undefined): number | null
	{
		if (!routeKey)
			return null;

		let i = this.routes.findIndex(a => a.key === routeKey);

		return i >= 0 ? i : null;
	}


	routeByKey(routeKey: string | null): RouteBehavior | null
	{
		return this.routes.find(a => a.key === routeKey) || null;
	}



	dir(): number
	{

		if (!this._activeRoute || !this._priorKey)
			return 0;


		let activeIndex = this.routes.indexOf(this._activeRoute);

		let priorIndex = this.indexOfKey(this._priorKey);


		if (priorIndex == null)
			return 0;


		return -activeIndex + priorIndex;

	}



	getNextRoute(offset: number, route?: RouteBehavior | null): RouteBehavior | null
	{

		if (route === undefined)
		{
			route = this.activeRoute;
		}

		if (!route)
			return null;


		let routes = this.routes;

		if (!routes?.length)
			return null;


		let i = routes.indexOf(route);


		if (i < 0)
		{
			i = 0;
		}


		i += offset;


		if (i < 0)
		{
			i = routes.length - 1;
		}
		else if (i >= routes.length)
		{
			i = 0;
		}


		return routes[i] || null;

	}



	//---



	activeIndex()
	{
		return this.indexOfKey(this._activeKey);
	}



	async activate(route: RouteBehavior | null): Promise<boolean>
	{

		route = route || null;


		let activeRoute = this.activeRoute;

		if (activeRoute === route)
			return false;


		if (route && this.routes.indexOf(route) < 0)
			throw new Error(`Can"t Find route#${route.iid} in routes`);


		//if (activeRoute?.onDeactivate && await activeRoute.onDeactivate() === false)
		//	return false;

		if (route?.props.onActivating && await route!.props.onActivating() !== false)
		{
			return true;
		}


		if (this.props.onActivating)
		{

			let newRouteKey = await this.props.onActivating(route);


			if (newRouteKey || newRouteKey === null)
			{
				route = this.routeByKey(newRouteKey);
			}

		}
		

		this.setActiveRoute(route);
		

		if (!this.parentRoute?.activate())
		{
			this.repaint();
		}


		return true;

	}



	private setActiveKey(value: string | null | undefined)
	{

		if (this._activeKey === value)
			return;


		this._priorKey = this._activeKey;
		this._activeKey = value;


		if (this._activeRoute && this._activeRoute.key !== value)
		{
			this._activeRoute = null;
		}

	}



	setActiveRoute(value: RouteBehavior | null)
	{

		if (this._activeRoute === value)
			return;


		this._routesIsChanged = true;

		this.setActiveKey(value?.key);

		this._activeRoute = value;

		value?.activated();

	}



	async activateByKey(routeKey: string | null): Promise<boolean>
	{

		let route = this.routeByKey(routeKey);

		if (!route)
			return false;


		return await this.activate(route);

	}



	async activateByIndex(routeIndex: number | null | undefined): Promise<boolean>
	{

		if (routeIndex == null)
			return false;


		let route = this.routes[routeIndex];


		if (!route)
			return false;


		return await this.activate(route);

	}



	//---

}




