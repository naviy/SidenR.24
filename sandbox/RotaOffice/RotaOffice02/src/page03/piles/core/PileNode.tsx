import { $defaultAnimationDurationMs, GlobalState } from '@libs';
import { styled } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
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

				<Tenta.Placeholder.NoCollector>

					{children}

				</Tenta.Placeholder.NoCollector>

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