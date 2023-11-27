import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TentaBase } from "./TentaBase";
import { TentaPlaceholder } from "./TentaPlaceholder";






//===






export { type TentaPhase as Phase } from "./TentaPhase";
export { type TentaStage as Stage } from "./TentaStage";

export { TentaBase as Base } from "./TentaBase";
export { TentaFocusable as Focusable } from "./TentaFocusable";

export import Placeholder = TentaPlaceholder;
export import Placeholders = TentaPlaceholder.Collector;


export { TentaDetails as Details } from "./TentaDetails";






//===






const Context = createContext<TentaBase | null>(null);



export function Provider(props: { tenta: TentaBase; children: ReactNode })
{
	return <Context.Provider
		value={props.tenta}
		children={props.children}
	/>;

}



export function use(): TentaBase | null
{
	return useContext(Context);
}






//===






const ByPhaseContext = createContext<{ tenta: TentaBase | null }>({ tenta: null });



export function ByPhaseProvider(props: { tenta: TentaBase; children: ReactNode })
{

	let { tenta } = props;

	tenta = useMemo(() => tenta, [tenta.phase]);

	return <ByPhaseContext.Provider
		value={{ tenta }}
		children={props.children}
	/>;

}



export function useByPhase(): TentaBase | null
{
	return useContext(ByPhaseContext).tenta;
}