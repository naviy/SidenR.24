import { PileNodeBackfill } from "./PileNodeBackfill";
import { PileNodeLinkLine } from "./PileNodeLinkLine";






//===






//export function PileNode({
//	tenta,
//	children
//}: {
//	tenta: Tenta.Base;
//	children: ReactNode;
//})
//{

//	return (

//		<GlobalState state={tenta.globalState}>

//			<Tenta.Provider tenta={tenta}>
//				<Tenta.ByPhaseProvider tenta={tenta}>

//					<Tenta.Collector.NoProvider>

//						{children}

//					</Tenta.Collector.NoProvider>

//				</Tenta.ByPhaseProvider>
//			</Tenta.Provider>

//		</GlobalState>

//	);

//}







export module PileNode
{

	//---



	export import LinkLine = PileNodeLinkLine;
	export import Backfill = PileNodeBackfill;



	//---

}