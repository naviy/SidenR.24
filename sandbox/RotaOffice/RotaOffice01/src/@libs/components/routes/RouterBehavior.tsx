import _ from "lodash";
import { $log, Repaintable, Values, _$log, useNew } from "../core";
import type { RouteBehavior } from "./RouteBehavior";
import * as Route from "./Route";
import { useEffect } from "react";






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


	routes: RouteBehavior[] = [];
	#routesIsChanged?: boolean;


	#routesByActivateTime?: RouteBehavior[];
	get routesByActivateTime(): RouteBehavior[]
	{

		if (this.#routesIsChanged || !this.#routesByActivateTime)
		{
			let minDate = new Date(-8640000000000000); //min date
			this.#routesByActivateTime = _.orderBy(this.routes, a => a.lastActivateTime || minDate, "desc");
		}


		return this.#routesByActivateTime;

	}


	#activeRoute: RouteBehavior | null = null;
	get activeRoute() { return this.#activeRoute; }


	#activeKey?: string | null;
	get activeKey(): string | null | undefined { return this.#activeKey; }


	#priorKey?: string | null;
	get priorKey(): string | null { return this.#priorKey || null; }


	#defaultActiveKey?: string | null;
	get defaultActiveKey() { return this.#defaultActiveKey; }



	//---



	use(props?: RouterBehaviorProps, cfg?: Repaintable.UseConfig)
	{

		Repaintable.use(this, cfg);


		this.parentRoute = Route.use();


		if (!props)
			return this;


		this.props = props || {};


		if (props.activeKey !== undefined)
		{
			this.#activeKey = typeof props.activeKey === "function" ? props.activeKey(this) : props.activeKey;
		}


		if (props.defaultActiveKey !== undefined)
		{
			this.#defaultActiveKey = props.defaultActiveKey;
		}



		this.#useRoutes(Values.many(props.routes));



		return this;

	}



	//---



	#useRoutes(routes: (RouteBehavior | false | 0)[])
	{

		routes.forEach(a => a && this.#register(a));
		_$log("routes:", routes);

		useEffect(() =>
			() => routes.forEach(a => a && this.#unregister(a))
		);


		if (this.#activeKey === undefined && this.routes.length)
		{
			this.#setActiveRoute(this.routes[0]);
		}

	}



	#register(route: RouteBehavior): boolean
	{

		let result = this.routes.register(route);

		if (result)
		{
			route.registred(this);
			this.#routesIsChanged = true;
		}


		if (this.activeKey !== undefined)
		{
			if (route.key === this.activeKey)
			{
				this.#setActiveRoute(route);
			}
		}

		else if (!this.activeRoute && this.defaultActiveKey !== undefined)
		{
			if (route.key === this.defaultActiveKey)
			{
				this.#setActiveRoute(route);
			}
		}


		return result;

	}


	#unregister(route: RouteBehavior): boolean
	{

		let result = this.routes.remove(route);

		if (result)
			this.#routesIsChanged = true;

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

		if (!this.#activeRoute || !this.#priorKey)
			return 0;


		let activeIndex = this.routes.indexOf(this.#activeRoute);

		let priorIndex = this.indexOfKey(this.#priorKey);


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
		return this.indexOfKey(this.#activeKey);
	}



	async activate(route: RouteBehavior | null): Promise<boolean>
	{

		$log("activate "+ route);

		route = route || null;

		_$log("route:", route);
		_$log("routes:", this.routes)


		let activeRoute = this.activeRoute;

		if (activeRoute === route)
			return false;


		if (route && this.routes.indexOf(route) < 0)
		{
			throw new Error(`Can"t Find route#${route.iid} in routes`);
		}


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


		this.#setActiveRoute(route);


		if (!this.parentRoute?.activate())
		{
			this.repaint();
		}


		return true;

	}



	#setActiveKey(value: string | null | undefined)
	{

		if (this.#activeKey === value)
			return;


		this.#priorKey = this.#activeKey;
		this.#activeKey = value;


		if (this.#activeRoute && this.#activeRoute.key !== value)
		{
			this.#activeRoute = null;
		}

	}



	#setActiveRoute(value: RouteBehavior | null)
	{

		if (this.#activeRoute === value)
			return;


		this.#routesIsChanged = true;

		this.#setActiveKey(value?.key);

		this.#activeRoute = value;

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




