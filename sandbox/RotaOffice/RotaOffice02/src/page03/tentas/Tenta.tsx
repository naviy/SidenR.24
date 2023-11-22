import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { TentaBase } from "./TentaBase";





//===






export { type TentaPhase as Phase } from "./TentaPhase";
export { type TentaStage as Stage } from "./TentaStage";

export { TentaBase as Base } from "./TentaBase";
export { TentaPhaser as Phaser } from "./TentaPhaser";
export { TentaFocusable as Focusable } from "./TentaFocusable";

export { TentaPlaceholder as Placeholder } from "./TentaPlaceholder";





//===






const Context = createContext<{ tenta: TentaBase | null }>({ tenta: null });



export function Provider(props: { tenta: TentaBase; children: ReactNode })
{

	let { tenta } = props;

	tenta = useMemo(() => tenta, [tenta.phase]);

	return <Context.Provider
		value={{ tenta }}
		children={props.children}
	/>;

}



export function use(): TentaBase | null
{
	return useContext(Context).tenta;
}