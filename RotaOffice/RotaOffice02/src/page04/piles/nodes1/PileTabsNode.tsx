//import Tab from "@mui/material/Tab";
//import Tabs from "@mui/material/Tabs";
import { $log, FillFade, Pane } from "@libs";
import { Tab, Tabs } from "@mui/material";
import type React from "react";
import { Tenta as Tenta_ } from "../../tentas";
import { PilePhaseIcon } from "../core/PilePhaseIcon";
import { PileNodeTail1 } from "./PileNodeTail1";
import { PileRowNode } from "./PileRowNode";
import { PileTabsNodeTenta } from "./PileTabsNodeTenta";






//===






interface PileTabsNodeProps extends PileRowNode.Props
{
	tenta: PileTabsNodeTenta;
}




export function PileTabsNode(props: PileTabsNodeProps)
{

	$log("PileTabsNode " + props.tenta)

	let { tenta } = props;

	let body: JSX.Element;


	//$log("tenta.activeTabIndex:", tenta.activeTabIndex)

	body = (
		<Pane start end pl12>
			<Tabs
				value={tenta.activeTabIndex + 1}
				onChange={(e, tabIndex) =>
				{
					e.stopPropagation();
					tenta.focus();
					tenta.activateTabByIndex(tabIndex - 1);
				}}
			>
				<Tab label={<div className="nowrap"><PilePhaseIcon tenta={tenta} /></div>} />
				{tenta.collectors?.map(a => <Tab key={a.id} label={a.id + ""} />)}
			</Tabs>
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



	export function defaultTailDecorator(tenta: Tenta)
	{

		let activeCol = tenta.activeTabCollector;
		//$log("activeCol:", activeCol?.id)

		return <>
			{tenta.collectors?.map(col =>

				<FillFade
					key={col.id}
					id={col.id + ""}
					in={col === activeCol || activeCol == null}
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
