import { Div, Focuser, Repaintable, useNew } from "@libs";
import { createContext, useContext, type ReactNode } from "react";
import { DesktopContainer } from "./DesktopContainer";
import { DesktopHeader } from "./DesktopHeader";
import { DesktopMain } from "./DesktopMain";
import { DesktopSider } from "./DesktopSider";






//===






export function DesktopLayout(props: {

	logo?: ReactNode;
	children?: ReactNode;

})
{

	const bhv = useNew(DesktopLayout.Behavior).use({
		defaultSiderOpen: true,
		logo: props.logo,
	});


	return (

		<Focuser root cursor ghost click="unfocus">

			<Div id="desktop-layout" fill flex>

				<DesktopLayout.Provider layout={bhv}>

					{props.children}

				</DesktopLayout.Provider>

			</Div>

		</Focuser>

	);

}




export module DesktopLayout
{


	//---




	export var defaultSiderWidth = 300;


	export const Sider = DesktopSider;
	export const Container = DesktopContainer;
	export const Header = DesktopHeader;
	export const Main = DesktopMain;




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

		logo?: ReactNode;



		//---



		use(cfg?: Repaintable.UseConfig & {

			siderWidth?: number;
			defaultSiderOpen?: boolean;

			logo?: ReactNode;

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


			this.logo = cfg?.logo;


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