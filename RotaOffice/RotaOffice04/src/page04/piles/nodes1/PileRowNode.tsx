import { ErrorBoundary } from "@app";
import { Div, ExpanderBaseBehavior, Focuser, Pane } from '@libs';
import React, { type ReactNode } from "react";
import { Tenta, Tenta as Tenta_ } from "../../tentas";
import { Pile } from "../core";
import { PileNodeTail1 } from "./PileNodeTail1";
import { PileRowNodeTenta } from "./PileRowNodeTenta";






//===






export interface PileRowNodeProps<TTenta extends PileRowNodeTenta = PileRowNodeTenta>
	extends Omit<Pane.RowProps, /*"id" | */"children">
{

	tenta: TTenta;

	linkToNext?: boolean;
	backfill?: boolean;

	tailExpanderRef?: React.RefObject<ExpanderBaseBehavior | null>;
	tailReexpand?: boolean;

	tailDecorator?: PileRowNode.TailDecorator<TTenta>;

}





export function PileRowNode({

	tenta,

	linkToNext,
	backfill,

	tailExpanderRef,
	tailReexpand,
	tailDecorator,

	children,

	...rowProps

}: PileRowNodeProps & {

	children?: ReactNode | (() => ReactNode)

})
{

	//_$log("PileNode for " + tenta)

	let btmMargin = tenta.btmMargin();
	let { tailIsVisible, tailIsSeparated } = tenta.state;
	//let isAccented = tenta.isAccented();


	//__$log("topMargin:", topMargin);
	//__$log("btmMargin:", btmMargin);
	//___$log("next.bodyTopMargin:", tenta.next()?.bodyTopMargin());
	//___$log("parentTailBtmMargin:", tenta.parentTailBtmMargin());


	tailDecorator ??= PileRowNode.defaultTailDecorator;

	//let hasVisibleTentas = tailIsVisible && tenta.hasVisibleTentas();
	//$log(tenta + "")
	//$log._("tailIsVisible:", tailIsVisible);
	//$log._("hasVisibleTentas: ", hasVisibleTentas);
	//$log._("btmMargin: ", btmMargin);

	let tailMt = !tailIsVisible ? 0 : btmMargin * 12;
	let tailMb = (tailIsVisible ? 0 : btmMargin * 12) + (backfill && tailIsVisible && tailIsSeparated ? 24 : 0);
	//$log._("tailM:", tailMt, tailMb);

	//tailMt *= 4;


	tenta.ff = Focuser.useGhost({
		name: `pile-row-node \ ff#${tenta.id}`,
		//focusable: true,
	});

	tenta.tailFf = Focuser.useGhost({
		name: `pile-row-node \ tailFf#${tenta.id}`,
	});


	return (

		<Tenta.ByPhaseProvider tenta={tenta}>

			<Focuser.Area ff={tenta.ff}			>

				<Div relative>

					<Pile.Node.LinkLine tenta={tenta} lineToNext={linkToNext} />

					{/*<Pile.ListBackfill mb={!tenta.parent ? 0 : 24} />*/}
					{backfill && <Pile.Node.Backfill
						mb={tailIsVisible ? 24 : 48}
						visible={tailIsSeparated}
					/>}


					<PileRowAccentor tenta={tenta}>


						<PileRowNodeBody
							tenta={tenta}
							rowProps={rowProps}
							children={children}
						/>

						<Focuser.Area ff={tenta.tailFf}>

							{/*	*/}{/*<Div borderGreen border4 m8>*/}
							<Pane.Col

								ref={tenta.tailFf.divRef}

								id={tenta + "-PileRowNode.tailCol"}
								expanderRef={tailExpanderRef}

								start={tailIsSeparated}
								expanded={tailIsVisible}
								noreexpand
								//noreexpand={!tailReexpand}

								wrapperCls={`mt${tailMt}`}
								mb={tailMb as any}
								addExpandedHeight={tailMt + tailMb}


							//borderGreen border4
							>
								{/*<Div borderBlue border4 m8>*/}
								{tailDecorator(tenta)}
								{/*</Div>*/}
							</Pane.Col>
							{/*</Div>*/}

						</Focuser.Area>


					</PileRowAccentor>

				</Div>

			</Focuser.Area>


		</Tenta.ByPhaseProvider >
	);

}





function PileRowAccentor({
	tenta,
	children,
}: {
	tenta: PileRowNodeTenta;
	children: [body: ReactNode, tail: ReactNode];
})
{

	//$log("PileRowAccentor " + tenta)

	//let forceUpdate = useForceUpdate();
	let [tailIsFocused, setTailIsFocused] = React.useState(false);


	function updateTailFocuser(tailFf: Focuser)
	{
		let itemFocused = !!tailFf.itemFocused && tenta.tailIsSeparated;

		if (tailIsFocused !== itemFocused)
			setTailIsFocused(itemFocused);
	}


	let parentAccent = Tenta.Accent.use();

	let accent = Math.max(
		tenta.bodyAccent,
		tailIsFocused ? Tenta.Accent.Max : 0,
		parentAccent
	) as Tenta.Accent;


	let tailAccent = tenta.tailIsVisible && !tenta.tailIsSeparated ? accent : Tenta.Accent.Min;


	React.useEffect(() =>

		tenta.tailFf!.on({
			focus: updateTailFocuser,
			unfocus: updateTailFocuser,
		})

	);


	return <>

		<Tenta.Accent.Provider accent={accent} children={children[0]} />
		{/*children[0]*/}
		{/*children[1]*/}
		<Tenta.Accent.Provider accent={tailAccent} children={children[1]} />

	</>;

}






function PileRowNodeBody({
	tenta,
	rowProps,
	children,
}: {
	tenta: PileRowNodeTenta;
	rowProps: Pane.RowProps;
	children?: ReactNode | (() => ReactNode)
})
{

	let accent = Tenta.Accent.use();

	let topMargin = tenta.topMargin();
	let btmMargin = tenta.btmMargin();
	let { tailIsVisible, tailIsSeparated } = tenta.state;

	let children2 = (typeof children === "function"
		? React.useMemo(children, [tenta.phase, tenta.stage])
		: children
	);


	tenta.bodyFf = Focuser.use({
		name: `pile-row-node \ bodyFf#${tenta.id}`,
		listener: tenta,
		autoFocus: tenta.getGlobalProp("focused") ? 200 : undefined,
	});


	return (

		<Focuser.Area ff={tenta.bodyFf}>

			<Pane.Row

				ref={tenta.bodyFf.divRef}

				//debug
				start
				end={!tailIsVisible || tailIsSeparated}

				rt={topMargin >= 2 ? "md" : topMargin === 1 ? "sm" : ""}
				rb={btmMargin >= 2 ? "md" : btmMargin === 1 ? "sm" : ""}

				bl={accent === 2 ? "xl" : accent === 1 ? "lg" : "md"}
				br={accent === 2 ? "xl" : accent === 1 ? "lg" : "md"}
				bt={topMargin && accent === 2 ? "xl" : topMargin && accent === 1 ? "lg" : topMargin >= 2 ? "md" : topMargin === 1 ? "md" : "sm"}
				bb={btmMargin && accent === 2 ? "xl" : btmMargin && accent === 1 ? "lg" : btmMargin >= 2 ? "md" : btmMargin === 1 ? "md" : ""}

				{...rowProps}

				ff
			>

				<ErrorBoundary>
					{tenta.toolsIsVisible ? Tenta.Details.wrap(tenta, children2) : children2}
					{/*<Div absolute top0 style={{left: 40} }>tailFf: {tenta.tailFf + ""}</Div>*/}
				</ErrorBoundary>

				<PileRowNodeForefill tenta={tenta} />

			</Pane.Row>

		</Focuser.Area>

	);

}






function PileRowNodeForefill({ tenta }: { tenta: PileRowNodeTenta })
{

	let [isFocused, setIsFocused] = React.useState(!tenta.rootFf?.itemFocused);


	function updateFocuser(/*ff: Focuser*/)
	{

		let focused = !!tenta.bodyFf?.focused || !!tenta.tailFf?.itemFocused || !tenta.rootFf?.itemFocused;

		if (isFocused !== focused)
		{
			setIsFocused(focused);
		}

	}


	React.useEffect(() =>
	{

		let { rootFf, ff } = tenta

		let unmount0 = rootFf?.on({

			focus: updateFocuser,
			unfocus: () => setIsFocused(true),

		});


		let unmount1 = ff?.on({

			itemFocus: updateFocuser,
			itemUnfocus: updateFocuser,

		});


		return () =>
		{
			unmount0?.();
			unmount1?.();
		}

	});


	return <Div
		fill
		bgBlack
		opacity0
		opacity0_2={!isFocused}
		animated
		nomouse
		style={{ willChange: "opacity" }}
	/>;

}






export module PileRowNode
{


	//---




	export type Props<TTenta extends Tenta = Tenta> = PileRowNodeProps<TTenta>;

	export import Tenta = PileRowNodeTenta;


	export type TailDecorator<TTenta extends Tenta_.Base = Tenta_.Base> = (tenta: TTenta) => ReactNode;




	export function defaultTailDecorator(tenta: Tenta_.Base)
	{
		return <>
			{tenta.collectors?.map(col =>
				<PileNodeTail1
					key={col.id}
					collector={col}
					cellIndent
					children={col.defaultListElement()}
				/>
			)}
		</>;
	}




	//---


}