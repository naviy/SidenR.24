import { GlobalState } from '@libs';
import type { ReactNode } from "react";
import { Tenta } from "../../tentas";
import { PileNodeLinkLine } from "./PileNodeLinkLine";






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

		<GlobalState state={tenta.placeholder?.globalState}>

			<Tenta.Provider tenta={tenta}>
				<Tenta.ByPhaseProvider tenta={tenta}>

					<Tenta.PlaceholderCollector.NoProvider>

						{children}

					</Tenta.PlaceholderCollector.NoProvider>

				</Tenta.ByPhaseProvider>
			</Tenta.Provider>

		</GlobalState>

	);

}







export module PileNode
{

	//---



	export import LinkLine = PileNodeLinkLine;



	//---

}