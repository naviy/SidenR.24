//import Tab from "@mui/material/Tab";
//import Tabs from "@mui/material/Tabs";
import { $log, FillFade, Pane } from "@libs";
import { Tenta as Tenta_ } from "../../tentas";
import { PilePhaseIcon } from "../core/PilePhaseIcon";
import { PileNodeTail1 } from "./PileNodeTail1";
import { PileRowNode } from "./PileRowNode";
import { PileTabsNodeTenta } from "./PileTabsNodeTenta";
import { styled } from "@mui/material/styles";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";






//===






interface PileTabsNodeProps extends PileRowNode.Props
{
	tenta: PileTabsNodeTenta;
}




export function PileTabsNode(props: PileTabsNodeProps)
{

	let { tenta } = props;


	tenta.use();


	let body: JSX.Element;


	//$log("tenta.activeTabIndex:", tenta.activeTabIndex)

	body = (
		<Pane start end p6 pl12>

			<PileTabsNode.NodeTabs
				value={tenta.activeTabIndex + 1}
				onChange={(e, tabIndex) =>
				{
					e.stopPropagation();
					tenta.focusBody();
					tenta.activateTabByIndex(tabIndex - 1);
				}}
			>

				<PileTabsNode.NodeZeroTab label={<PilePhaseIcon tenta={tenta} />} />

				{tenta.collectors?.map(a =>
					<PileTabsNode.NodeTab key={a.id} label={a.title() ?? (a.id + "")} />
				)}

			</PileTabsNode.NodeTabs>

		</Pane>
	);


	return PileRowNode({

		//tailReexpand: true,
		tailExpanderRef: tenta.tailExpanderRef,

		...props,

		tailDecorator: PileTabsNode.defaultTailDecorator as PileRowNode.TailDecorator,

		children: body,

	});

}






export module PileTabsNode
{

	//---



	export type Props = PileTabsNodeProps;

	export import Tenta = PileTabsNodeTenta;



	//---



	export var NodeTabs = styled(Tabs)({

		minHeight: 24,

		">.MuiTabs-indicator": {
			height: "4px!important",
		},

	})



	export var NodeZeroTab = styled(Tab)({

		minHeight: 24,
		padding: "6px 0",
		minWidth: 24,
	})


	export var NodeTab = styled(Tab)({

		minHeight: 24,
		padding: "6px 12px 6px 0",
		minWidth: 24,
		fontSize: "1em",
	})



	//---



	export function defaultTailDecorator(tenta: Tenta)
	{

		let activeCol = tenta.activeTabCollector;
		//$log("activeCol:", activeCol?.id)

		return <>
			{tenta.collectors?.map(col =>

				<FillFade
					key={col.id}
					id={col.id + ""}
					in={col === activeCol}
					mountOnEnter
					unmountOnExit
				>

					<PileNodeTail1
						key={col.id}
						collector={col}
						cellIndent
						children={col.defaultListElement()}
					//children={<Tenta_.Collector.List bhv={col} />}
					/>

				</FillFade>

			)}
		</>;
	}



	//---



	export class FunctionalTenta extends Tenta_.Functional(Tenta) { }
	export type FT = FunctionalTenta;


	export type TentaFactory<TArgs extends any[] = []> = (/*id: React.Key,*/ ...args: TArgs) => FunctionalTenta;
	export type TF<TArgs extends any[] = []> = TentaFactory<TArgs>;


	export function createFactory<TArgs extends any[] = []>(
		configGetter: Tenta_.Functional.ConfigAlias<FT, TArgs>
	): TentaFactory<TArgs>
	{
		return Tenta_.Functional.createFactory<FunctionalTenta, TArgs>(FunctionalTenta, configGetter);
	}



	//---

}
