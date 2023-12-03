import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Constructor } from "../../@libs";
import type { TentaBase } from "./TentaBase";
import { TentaCollector } from "./TentaCollector";






//===






export { type TentaPhase as Phase } from "./TentaPhase";
export { type TentaStage as Stage } from "./TentaStage";

export { TentaBase as Base, isTenta } from "./TentaBase";
export { TentaFocusable as Focusable } from "./TentaFocusable";

export import Collector = TentaCollector;
export import Collection = TentaCollector.Provider;
export import NoProviders = TentaCollector.NoProvider;

//export { TentaDescriptor as Descriptor } from "./TentaDescriptor";


export { TentaDetails as Details } from "./TentaDetails";






//===






const Context = createContext<TentaBase | null | undefined>(undefined);



export function Provider(props: { tenta: TentaBase; children: ReactNode })
{
	return <Context.Provider
		value={props.tenta}
		children={props.children}
	/>;

}



export function use(): TentaBase | null | undefined
{
	return useContext(Context);
}



//export function useById<TTenta extends TentaBase = TentaBase>(
//	tentaClass: Constructor<TTenta>,
//	id: React.Key,
//	collector?: TentaCollector | null
//): TTenta
//{

//	if (collector === undefined)
//	{
//		collector = TentaCollector.use();
//	}


//	if (collector == null)
//	{
//		throw Error(`Не найден collector для tenta#${id}`);

//	}


//	let tenta = collector.byId(id) || null;

//	if (!tenta)
//		throw Error(`Не найден tenta#${id} в collector#${collector.id}`);


//	if (!(tenta instanceof tentaClass))
//		throw Error(`В collector#${collector.id} найден tenta#${id} класса ${tenta.constructor.name}, а требуется класс ${tentaClass.name}`);


//	return tenta as TTenta;

//}






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