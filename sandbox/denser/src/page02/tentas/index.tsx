import { createContext, ReactNode, useContext } from "react";
import { TentaBehavior } from "./TentaBehavior";
import { TentaPhaser } from "./TentaPhaser";






export module Tenta
{

	//---



	export const Behavior = TentaBehavior;



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



		//---



		export interface Filter
		{
			phase?: number;
			minPhase?: number;
			maxPhase?: number;
		}



		export type FilterProps = (
			{ phase: number } |
			{ minPhase: number; maxPhase?: number; } |
			{ maxPhase: number; }
		);



		export function useFilter<P extends Filter>(props: P): [boolean, Extract<P, Filter>]
		{

			let { phase, minPhase, maxPhase, ...restProps } = props;

			let phase0 = use();


			let filtred = (
				phase0 !== undefined &&
				(phase === undefined || phase0 === phase) &&
				(minPhase === undefined || phase0 >= minPhase) &&
				(maxPhase === undefined || phase0 <= maxPhase)
			);


			return [filtred, restProps as any];
		}



		//---

	}



	//---

}