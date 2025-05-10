import React from "react";

import { Caret as Caret_ } from "./ff.Caret";
import { Core as Core_, currentFocuser } from "./ff.Core";
import { Events as Events_ } from "./ff.Events";
import { FocuserBehavior } from "./ff.FocuserBehavior";
import type { FocuserProps } from "./ff.Props";
import { SpaWaitingMask as SpaWaitingMask_ } from "./ff.SpaWaitingMask";
import { Task as Task_ } from "./ff.Task";






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


	export import SpaWaitingMask = SpaWaitingMask_;

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


		let ffRef = React.useRef<Focuser>(null);


		let ff = ffRef.current ?? (ffRef.current = new FocuserBehavior(parent));

		ff.useProps(props);


		return ff;

	}


	export function useGhost(props?: FocuserProps): Focuser
	{

		return use({ ghost: true, ...props });

	}




	//---




	export function Area({ ff, children }: { ff: Focuser | null; children: React.ReactNode })
	{

		//$log("***", ff + "");


		//ff?.clearState();


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



		let body: React.ReactNode = <Context.Provider
			value={ff}
			children={children}
		/>;


		if (ff.props.scrollable)
		{


			body = <>
				{body}
				<div ref={ff.scrollAnchorRef} className="displayNone" />
			</>;
		}


		return body;

	}




	//---



}

