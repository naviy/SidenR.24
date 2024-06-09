import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TentaBase } from "./TentaBase";
import { TentaCollector } from "./TentaCollector";






//===






export { TentaPhase as Phase } from "./TentaPhase";
export { TentaStage as Stage } from "./TentaStage";
export { TentaAccent as Accent } from "./TentaAccent";

export { TentaBase as Base, isTenta } from "./TentaBase";
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