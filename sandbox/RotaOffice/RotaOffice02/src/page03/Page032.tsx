import { $defaultAnimationDurationMs, Div, Expander, Focuser, GlobalState, Pane, Route, bgColors, useNew } from '@libs';
import FestivalIcon from '@mui/icons-material/Festival';
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import React, { useReducer } from "react";
import { Tenta } from './tentas';
import { TentaStage } from "./tentas/TentaStage";






//===






export module Page032
{


	export const route = Route.create({
		key: "page032",
		icon: <FestivalIcon />,
		title: "Page 032",
		content: () => <Content />,
	});


	export function Content()
	{

		return <>

			<GlobalState name="page03">

				<Div mx200 m100>

					<GlobalState name="Rows05Pile">

						<Pane.Col start end b="lg" r="lg">
							<Pane.Ghost start end b="sm" r="">
								<Rows05 root />
							</Pane.Ghost>
						</Pane.Col>

					</GlobalState>

				</Div>

			</GlobalState>

		</>;

	}


}






//===






function Rows05({ root }: { root?: boolean })
{
	return <>

		<Pane.Col start end>

			<PileListBackfill />

			<Tenta.Placeholder.Collector
				globalState="rows05"
				root={root}
				placeholders={[1, 2, 3, 4, 5, 6, 7]}
			//placeholders={[1, 2, 3]}
			>

				<Row05 id={1} />
				<Row05 id={2} />
				<Row05 id={3} />
				<Row05 id={4} />
				<Row05 id={5} />
				<Row05 id={6} />
				<Row05 id={7} />

			</Tenta.Placeholder.Collector>

		</Pane.Col>

	</>;
}



function Row05(props: PileRowProps)
{
	//$log("Row05.id:", props.id)


	return <PileNode {...props}>

		<RowBody id={props.id}>

			<>
				<Pane start id="pane-1" p12><span>111 1111 11111 111111</span></Pane>
				<Pane p12>222 2222 22222 222222</Pane>
				<Pane end p12 textRight>333 3333 33333 333333</Pane>
			</>

			<>
				<Pane start p12 vcenter>aaa aaaaa aaaaaaa aaaaaaaa</Pane>
				<Pane p12 vcenter>bbbb bbbb bbbbb bbbbbbbbb bbb</Pane>
				<Pane p12 vcenter>ccc cccc cccccc cccccccc cccc ccccccc</Pane>
				<Pane end p12 vcenter textRight>
					<div>
						333 3333 33333 333333
						<Cell3 />
					</div>
				</Pane>
			</>

			<>
				<Pane l={1} center vcenter>aaa aaa aaaa</Pane>
			</>

			<>
				<Pane l={1} center vcenter>xxx xxx xxxx</Pane>
				<Pane l={1} center vcenter>yyy yyy yyyy</Pane>
				<Pane l={1} center vcenter>zzz zzz zzzz</Pane>
			</>

			<Pane.Col flex1>
				<Pane l={1} center vcenter>bbb bbb bbbb</Pane>
				<Pane l={1} center vcenter>ccc ccc cccc</Pane>
			</Pane.Col>

			<>
				<Pane start p12 vcenter>222 2222 22222 222222</Pane>
				<Pane end p12 textRight vcenter>333 3333 33333 333333</Pane>
			</>

		</RowBody>


		<>
			<Rows05 />
		</>


	</PileNode>;



	function Cell3()
	{

		let [expanded, toggleExpanded] = useReducer(a => !a, false);
		let [expanded2, toggleExpanded2] = useReducer(a => !a, false);

		return <>
			<Button onClick={e => { e.stopPropagation(); toggleExpanded(); }}>TOGGLE</Button>
			<Expander id="2" expanded={expanded}>
				<div>4444 4 4444 44 4 444444 4 44444 4444</div>
				<Button onClick={e => { e.stopPropagation(); toggleExpanded2(); }}>TOGGLE2</Button>
				{expanded2 && <div>5555 5 5555 55 5 555555 5 55555 5555</div>}
			</Expander>
		</>;

	}


	function RowBody(props: { id: React.Key; children: [JSX.Element, JSX.Element, JSX.Element, JSX.Element, JSX.Element, JSX.Element] })
	{

		let phase = Tenta.Phase.use();
		let parts = props.children;

		//$log("RowRim", props.id)


		return <>

			<Pane.Col start>

				<Pane.Row start end={phase !== 1}>
					{parts[0]}
				</Pane.Row>

				<Pane.Row
					end
					id={`row05-expander #${props.id}`}
					expanded={phase === 1}					
				//noreexpand
				>
					{parts[1]}
				</Pane.Row>

			</Pane.Col>

			<Pane.Row id="row05-bottom" end>

				{/*<Pane.Col gapi l={120}>*/}
				{/*	<TransitionGroup>*/}
				{/*		{phase !== 1 && <FillFade>{Pane.injectProps(fs[2])}</FillFade>}*/}
				{/*		{phase === 1 && <FillFade>{Pane.injectProps(fs[3])}</FillFade>}*/}
				{/*	</TransitionGroup>*/}
				{/*</Pane.Col>*/}

				{/*<Pane.Col l={120}>*/}
				{/*	<Pane.Row end={phase !== 1}>*/}
				{/*		{fs[2]}*/}
				{/*	</Pane.Row>*/}
				{/*	<Pane.Col l={2} expanded={phase === 1} pt1={phase === 1}>*/}
				{/*		{fs[4]}*/}
				{/*	</Pane.Col>*/}
				{/*</Pane.Col>*/}

				{parts[5]}

			</Pane.Row >

		</>;

	}


}




//---




interface PileRowProps extends Omit<Pane.RowProps, 'id'>
{
	id: React.Key;
}




function PileNode({ id, ...rowProps }: PileRowProps)
{

	let placeholder = Tenta.Placeholder.use(id);

	let tenta = useNew(Tenta.Behavior1).use({ placeholder });


	let topStage = TentaStage.max(tenta.stage, placeholder?.prior?.stage);
	let btmStage = TentaStage.max(tenta.stage, placeholder?.next?.stage);

	let isFirst = !placeholder?.prior;
	let isLast = !placeholder?.next;


	let linkLine = !placeholder || !placeholder.collector.root;
	let linkToNext = false;


	let parts = React.Children.toArray(rowProps.children);



	return (


		<GlobalState state={placeholder?.globalState}>

			<Tenta.Phase.Provider phase={tenta.phase}>

				<Tenta.Placeholder.NoCollector>

					<Focuser ref={tenta.rootFfRef} name={`pile-row#${id}`} ghost focusable>

						<Div
							relative
							pb={btmStage === "expanded" ? 16 : btmStage === "opened" ? 24 : 0}
							animated
						>


							<PileNodeLinkLine width={linkLine ? 36 : 0}>

								{isFirst && <div className="line-to-root" />}
								<div className="angle" />
								{(!isLast || linkToNext) && <div className="line-to-next" />}

							</PileNodeLinkLine>


							<Pane.Ghost
								id={`pile-row#${id}`}

								start={!tenta.collapsed || isFirst || !placeholder!.prior!.collapsed}
								end={!tenta.collapsed || isLast || !placeholder!.next!.collapsed}


								{...rowProps}

							//debug={tenta.phase > 0}
							>

								<Focuser
									ref={tenta.ffRef}
									name={`pile-row-body#${id}`}
									listener={tenta}
									autoFocus={tenta.getGlobalProp("focused") ? 200 : undefined}
								>

									<Pane.Row
										start
										end
										bl={tenta.expanded ? "lg" : undefined}
										br={!tenta.collapsed ? "lg" : undefined}
										bt={!isFirst && tenta.expanded ? undefined : !isFirst && tenta.collapsed && !placeholder!.prior!.collapsed ? "md" : undefined}
										bb={!isLast && tenta.expanded ? undefined : !isLast && tenta.collapsed && !placeholder!.next!.collapsed ? "md" : undefined}
										rt={tenta.collapsed && !isFirst && !placeholder!.prior!.collapsed ? "xs" : tenta.expanded && !isFirst ? "sm" : undefined}
										rb={tenta.collapsed && !isLast && !placeholder!.next!.collapsed ? "xs" : tenta.expanded && !isLast ? "sm" : undefined}

										e={tenta.opened ? "L2" : tenta.expanded ? "0" : btmStage === "expanded" ? "L3b" : btmStage === "opened" ? "L2b" : topStage === "expanded" ? "L3t" : topStage === "opened" ? "L2t" : "0"}

									>

										<Focuser.Caret use={usePileRowCaretProps} />

										{parts[0]}

									</Pane.Row>

								</Focuser>

								{parts[1] &&

									<Focuser ref={tenta.itemsFfRef} ghost>

										<Pane.Col
											start end
											expanded={tenta.opened}
											wrapperCls="pt24 pl60 pr36"
											children={parts[1]}
										/>

									</Focuser>
								}

							</Pane.Ghost>


						</Div>

					</Focuser>

				</Tenta.Placeholder.NoCollector>

			</Tenta.Phase.Provider>

		</GlobalState>

	);

}




function usePileRowCaretProps()
{
	let row = Pane.ContainerInfo.use();
	return { borderRadius: row && Pane.Radius.css(row.rtl, row.rtr, row.rbr, row.rbl) };
}




const PileListBackfill = styled("div")({

	position: "absolute",
	inset: 1,

	borderRadius: "inherit",
	border: `2px dotted ${bgColors[2]}`,

	background: "rgba(255,255,255,.33)",

});




const PileNodeLinkLine = styled(
	"div",
	{ shouldForwardProp: p => p !== "width" && p !== "thickness" }
)<{
	width: number;
	thickness?: number;
}>(({ width, thickness }) =>
({

	position: "absolute",
	left: -width,
	top: 0,
	bottom: 0,
	width,
	opacity: width ? 1 : 0,

	transition: `all ${$defaultAnimationDurationMs}ms ease-in-out`,


	"> .angle": {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		height: 24,

		border: `${thickness || 2}px solid ${bgColors[3]}`,
		borderTopWidth: 0,
		borderRightWidth: 0,
		borderBottomLeftRadius: 12,
	},

	"> .line-to-root": {
		position: "absolute",
		left: 0,
		right: 0,
		top: -24,
		height: 24,
		borderLeft: `${thickness || 2}px solid ${bgColors[3]}`,
	},

	"> .line-to-next": {
		position: "absolute",
		inset: 0,
		borderLeft: `${thickness || 2}px solid ${bgColors[3]}`,
	},

}));