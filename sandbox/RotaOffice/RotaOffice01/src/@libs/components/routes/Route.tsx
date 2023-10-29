import { createContext, useContext, type ReactNode } from "react";
import { RouteBehavior, type RouteBehaviorProps } from "./RouteBehavior";
import { Router } from "./Router";






//===






export { RouteBehavior as Behavior } from "./RouteBehavior"
export { Router } from "./Router"
export { RouteFader as Fader } from "./RouteFader"
export { RouteSlider as Slider } from "./RouteSlider"






//===






export function create(props: RouteBehaviorProps)
{
	return new RouteBehavior(props);
}




const Context = createContext<RouteBehavior | null>(null);


export function Provider(props: { route: RouteBehavior | null; children: ReactNode })
{
	return <Context.Provider
		value={props.route}
		children={props.children}
	/>;
}


export function use(): RouteBehavior | null
{
	return useContext(Context);
}



export function useActive()
{
	return Router.use()?.activeRoute;
}






//===






//export function render(
//	route: RouteBehavior | null | undefined,
//	children?: RouteChildren
//)
//{

//	if (route === undefined)
//	{
//		route = useActive();
//	}


//	if (route == null)
//		return null;


//	let body = route.getChildren(children);


//	body = <Context.Provider value={route} children={body} />;


//	return body;

//}

export type Children/*<TRoute extends RouteBehavior = RouteBehavior>*/ = (
	"icon" | "title" | "description" | "content" |
	((route: RouteBehavior/*TRoute*/) => ReactNode) |
	ReactNode
);




export function Children(
	route: RouteBehavior | null | undefined,
	children?: Children
)
{

	if (route === undefined)
	{
		let currentRoute = use();
		let activeRoute = useActive();

		route = currentRoute || activeRoute;
	}


	if (route == null)
		return null;


	let body: ReactNode = undefined;


	if (children === undefined)
	{
		body = route.content();
	}
	else if (children === null)
	{
		body = null;
	}
	else if (typeof children === 'function')
	{
		body = (children as any)(route);
	}
	else if (typeof children === 'string' && (route as any)[children])
	{
		body = (route as any)[children]();
	}
	else
	{
		body = children;
	}



	body = <Provider route={route} children={body} />;


	return body;

}



export function Icon({ route }: { route?: RouteBehavior | null })
{
	return Children(route, "icon");
}


export function Title({ route }: { route?: RouteBehavior | null })
{
	return Children(route, "title");
}


export function IconTitle({ route }: { route?: RouteBehavior | null })
{
	return Children(route, r => <>{r.icon()}{r.title()}</>);
}


export function Content({ route }: { route?: RouteBehavior | null })
{
	return Children(route, "content");
}
