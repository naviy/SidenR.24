import { createContext, type ReactNode, useContext } from "react";
import { TentaBehavior } from "./TentaBehavior";
import type { TentaPhaser } from "./TentaPhaser";
import { TentaPlaceholder } from "./TentaPlaceholder";






export module Tenta
{


	//---



	export type Behavior = TentaBehavior;
	export const Behavior = TentaBehavior;

	export type Placeholder = typeof TentaPlaceholder;
	export const Placeholder = TentaPlaceholder;



	//---



	export module Phase
	{

		//---



		export const Context = createContext<number | undefined>(undefined);



		export function Provider(props:
			{ phase: number; children: ReactNode; } |
			{ bhv: TentaPhaser; children: ReactNode; }
		)
		{

			let phase = (props as any)["phase"] ?? ((props as any)["bhv"] as TentaPhaser).phase;


			return <Context.Provider
				value={phase}
				children={props.children}
			/>;

		}



		export function use()
		{
			return useContext(Context);
		}


		export function useProps<P>(propsByPhase: (phase: number) => Partial<P>): Partial<P> | undefined
		{
			let phase = useContext(Context);
			return phase === undefined ? undefined : propsByPhase(phase);
		}



		//---



		export module expanded
		{


			export function equal1()
			{
				let phase = use();
				return { expanded: phase === 1 };
			}


			export function notEqual1()
			{
				let phase = use();
				return { expanded: phase !== 1 };
			}


		}



		//export interface Filter
		//{
		//	phase?: number;
		//	minPhase?: number;
		//	maxPhase?: number;
		//}



		//export type FilterProps = (
		//	{ phase: number } |
		//	{ minPhase: number; maxPhase?: number; } |
		//	{ maxPhase: number; }
		//);



		//export function useFilter<P extends Filter>(props: P): [boolean, Extract<P, Filter>]
		//{

		//	let { phase, minPhase, maxPhase, ...restProps } = props;

		//	let phase0 = use();


		//	let filtred = (
		//		phase0 !== undefined &&
		//		(phase === undefined || phase0 === phase) &&
		//		(minPhase === undefined || phase0 >= minPhase) &&
		//		(maxPhase === undefined || phase0 <= maxPhase)
		//	);


		//	return [filtred, restProps as any];
		//}


		//export function useFilter(phase: number): boolean;
		//export function useFilter(minPhase: number | null, maxPhase: number | null): boolean;

		//export function useFilter(phase0: number | null, phase1?: number | null): boolean
		//{

		//	let phase = use();

		//	if (phase === undefined)
		//	{
		//		return false;
		//	}


		//	if (phase1 === undefined)
		//	{
		//		return phase === phase0;
		//	}


		//	return (
		//		(phase0 == null || phase >= phase0) &&
		//		(phase1 == null || phase <= phase1)
		//	);

		//}


		//---

	}



	//---


}