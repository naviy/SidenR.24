import { GlobalState } from '@libs';
import type { ReactNode } from "react";
import { Tenta } from "../../tentas";
import { PileNodeLinkLine } from "./PileNodeLinkLine";
import { PileNodeBackfill } from "./PileNodeBackfill";






//===






export function PileNode({
	tenta,
	children
}: {
	tenta: Tenta.Base;
	children: ReactNode;
})
{

	return (

		<GlobalState state={tenta.globalState}>

			<Tenta.Provider tenta={tenta}>
				<Tenta.ByPhaseProvider tenta={tenta}>

					<Tenta.Collector.NoProvider>

						{children}

					</Tenta.Collector.NoProvider>

				</Tenta.ByPhaseProvider>
			</Tenta.Provider>

		</GlobalState>

	);

}







export module PileNode
{

	//---



	export import LinkLine = PileNodeLinkLine;
	export import Backfill = PileNodeBackfill;



	//---

}