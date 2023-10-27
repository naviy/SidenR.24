import type { ReactNode } from "react";
import { GlobalState } from "../core";
import * as Route from "./Route";
import { type RouteBehavior } from "./RouteBehavior";






//===






export type RouteChildren<TRoute extends RouteBehavior = RouteBehavior> = (
	keyof TRoute |
	((route: TRoute) => ReactNode) |
	ReactNode
);






export function RouteChildren<TRoute extends RouteBehavior = RouteBehavior>({

	route, children

}: {

	route: TRoute | null | undefined;
	children: RouteChildren<TRoute>;

}): JSX.Element | null
{

	if (!route)
		return null;


	return (

		<GlobalState state={route.globalState}>

			<Route.Provider
				route={route}
				children={route.getChildren(children)}
			/>

		</GlobalState>

	);

}
