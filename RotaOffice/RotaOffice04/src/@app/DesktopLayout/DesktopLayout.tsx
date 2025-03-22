import { Div, Focuser, Repaintable, useNew } from "@libs";
import { createContext, useContext, type ReactNode } from "react";
import { DesktopContainer } from "./DesktopContainer";
import { DesktopHeader } from "./DesktopHeader";
import { DesktopMain } from "./DesktopMain";
import { DesktopSider } from "./DesktopSider";
import { DesktopContent } from "./DesktopContent";






//===






export function DesktopLayout(props: { children?: ReactNode; })
{

	const bhv = useNew(DesktopLayout.Behavior).use({
		defaultSiderOpen: true,
	});


	return (

		<Focuser.Ghost root cursor>

			<Div id="desktop-layout" fill flex hidden>

				<DesktopLayout.Provider layout={bhv}>

					{props.children}

				</DesktopLayout.Provider>

			</Div>

		</Focuser.Ghost>

	);

}




export module DesktopLayout
{


	//---




	export var defaultSiderWidth = 240;


	export import Sider = DesktopSider;
	export import Container = DesktopContainer;
	export import Header = DesktopHeader;
	export import Main = DesktopMain;
	export import Content = DesktopContent;




	//---




	const Context = createContext<{ layout: Behavior | null }>({ layout: null });



	export function Provider(props: { layout: Behavior; children: ReactNode })
	{
		return <Context.Provider
			value={{ layout: props.layout }}
			children={props.children}
		/>;
	}



	export function use(): Behavior | null
	{
		return useContext(Context)?.layout;
	}




	//---




	export class Behavior extends Repaintable()
	{

		//---


		siderWidth!: number;
		siderIsOpened!: boolean;


		//---



		use(cfg?: Repaintable.UseConfig & {

			siderWidth?: number;
			defaultSiderOpen?: boolean;

		})
		{

			Repaintable.use(this, cfg);


			if (this.siderWidth === undefined)
			{
				this.siderWidth = cfg?.siderWidth ?? defaultSiderWidth;
			}


			if (this.siderIsOpened === undefined)
			{
				this.siderIsOpened = !!cfg?.defaultSiderOpen;
			}


			return this;

		}



		//---



		toggleSider = () =>
		{
			this.siderIsOpened = !this.siderIsOpened;

			this.repaint();
		}



		//---

	}




	//---


}