import React from "react";

import { Div } from "../core";

import { Caret as Caret_ } from "./ff.Caret";
import { Core as Core_, currentFocuser } from "./ff.Core";
import { Events as Events_ } from "./ff.Events";
import { FocuserBehavior } from "./ff.FocuserBehavior";
import { Task as Task_ } from "./ff.Task";
import type { FocuserProps } from "./ff.Props";






//===






export type Focuser = FocuserBehavior;




export function Focuser({ children, ...props }: FocuserProps & { children: React.ReactNode })
{

	let ff = Focuser.use(props);

	return <Focuser.Area ff={ff} children={children} />;

}





export module Focuser
{



	//---



	export type Behavior = FocuserBehavior;
	export var Behavior = FocuserBehavior;


	export var Core = Core_;

	export var current = currentFocuser;


	export type Props = FocuserProps;


	export type CaretProps = Caret_.Props;
	export import Caret = Caret_;


	export import Events = Events_;
	export type Listener = Events_.Listener;
	export type ff_Listener = Events_.ff_Listener;


	export var Tasks = Task_;




	//---




	export var Context = React.createContext<Focuser | null>(null);


	export function useContext(): Focuser | null
	{
		return React.useContext(Context);
	}




	//---




	export function use(props: FocuserProps): Focuser
	{

		let parent = useContext();


		let ffRef = React.useRef<Focuser>();


		let ff = ffRef.current ?? (ffRef.current = new FocuserBehavior(parent));

		ff.setProps(props);


		return ff;

	}


	export function useGhost(props?: FocuserProps): Focuser
	{

		return use({ ghost: true, ...props });

	}




	//---




	export function Area({ ff, children }: { ff: Focuser | null; children: React.ReactNode })
	{

		React.useLayoutEffect(() =>
		{
			ff?.willMount();
		}, []);

		React.useLayoutEffect(() =>
		{
			ff?.updateDidMount();
			return () => ff?.updateDidUnmount();
		});

		React.useLayoutEffect(() =>
		{
			ff?.didMount();
			return () => ff?.didUnmount();
		}, []);



		if (!ff)
			return null;



		ff.clearState();



		let body: React.ReactNode = <Context.Provider
			value={ff}
			children={children}
		/>;


		if (ff.props.cursor)
		{

			ff.setCursorEl ??= a => ff._cursorEl = a;


			body = <>
				{body}
				<Div ref={ff.setCursorEl} display="none" />
			</>;
		}


		return body;

	}




	//export function Ghost({ children, ...props }: FocuserProps & { children: React.ReactNode })
	//{

	//	let ff = use({ ghost: true, ...props });

	//	return <Focuser ff={ff} children={children} />;

	//}




	//---



}

