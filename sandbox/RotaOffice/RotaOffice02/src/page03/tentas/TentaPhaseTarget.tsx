import { TentaPhase } from "./TentaPhase";
import { TentaStage } from "./TentaStage";






//===






export type TentaPhaseTarget<P extends string = ""> = (
	P extends ""
	? boolean | TentaPhase | TentaStage | undefined
	: { [p in P]?: boolean } | { [p in P]: TentaPhase } | { [p in P]: TentaStage }
);




export module TentaPhaseTarget
{


	//---




	export function useConvert<K extends string>(
		props: { [p in K]?: TentaPhaseTarget }
	): Partial<Record<K, boolean>>
	{

		let keys = Object.keys(props);
		let values = Object.values(props);

		if (values.every(a => a === undefined))
		{
			return {};
		}


		let phase: number | undefined = values.find(a => typeof a === "number") ? TentaPhase.use() : undefined;
		let stage: TentaStage | undefined = values.find(a => typeof a === "string") ? TentaStage.use() : undefined;


		let cfg = { phase, stage };
		let result = {} as Record<K, boolean | undefined>;


		for (let key of keys)
		{
			(result as any)[key] = convert((props as any)[key], cfg);
		}


		return result;

	}




	export function convert(
		value: TentaPhaseTarget,
		cfg: {
			phase: TentaPhase | undefined;
			stage: TentaStage | undefined;
		}
	): boolean | undefined
	{

		if (typeof value === "boolean")
		{
			return value;
		}

		if (typeof value === "string" && cfg.stage != null)
		{
			return value === cfg.stage;
		}

		if (typeof value === "number" && cfg.phase != null)
		{
			return value === cfg.phase;
		}


		return undefined;

	}




	//---


}