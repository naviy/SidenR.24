





//===

import { createContext, useContext, type ReactNode } from "react";






export type TentaAccent = 0 | 1 | 2;




export module TentaAccent
{


	//---



	export var Min: TentaAccent = 0;
	export var Max: TentaAccent = 2;



	//---



	export var Context = createContext<TentaAccent>(Min);



	export function Provider(props: { accent: TentaAccent; children: ReactNode; })
	{
		return <Context.Provider
			value={props.accent}
			children={props.children}
		/>;
	}



	export function use(value?: TentaAccent): TentaAccent
	{
		return value !== undefined ? value : useContext(Context);
	}



	//---


}
