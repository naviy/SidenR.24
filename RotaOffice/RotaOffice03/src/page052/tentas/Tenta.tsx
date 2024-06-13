import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TentaBase } from "./TentaBase";
import { TentaCollector } from "./TentaCollector";
import { $log } from "@libs";






//===






export { TentaAccent as Accent } from "./TentaAccent";

export
{
	type TentaExpandPhase as ExpandPhase,
	type TentaOpenPhase as OpenPhase,
	TentaBase as Base,
	isTenta,
} from "./TentaBase";

export { TentaFocusable as Focusable } from "./TentaFocusable";

export import Collector = TentaCollector;
export import Collection = TentaCollector.List;
//export import NoProviders = TentaCollector.NoProvider;

//export { TentaDescriptor as Descriptor } from "./TentaDescriptor";


export { TentaDetails as Details } from "./TentaDetails";


export {
	TentaFunctional as Functional,
} from "./TentaFunctional";





//===






const ByPhaseContext = createContext<{ tenta: TentaBase | null }>({ tenta: null });



export function ByPhaseProvider(props: { tenta: TentaBase; children: ReactNode })
{

	let tenta0 = props.tenta;
	let tenta = useMemo(() => tenta0, [tenta0, tenta0.expandPhase * 1000 + tenta0.openPhase]);
	//$log("ByPhaseProvider.tenta: " + tenta)
	return <ByPhaseContext.Provider
		value={{ tenta }}
		children={props.children}
	/>;

}



export function useByPhase(): TentaBase | null
{
	return useContext(ByPhaseContext).tenta;
}