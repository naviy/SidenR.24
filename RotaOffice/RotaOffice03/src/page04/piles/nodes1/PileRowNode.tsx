import { ErrorBoundary } from "@app";
import { $log, Div, ExpanderBaseBehavior, Focuser, Pane, _$log, __$log } from '@libs';
import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { Tenta, Tenta as Tenta_ } from "../../tentas";
import { Pile } from "../core";
import { PileNodeTail1 } from "./PileNodeTail1";
import { PileRowNodeTenta } from "./PileRowNodeTenta";






//===






export interface PileRowNodeProps extends Omit<Pane.RowProps, /*"id" | */"children">
{

	tenta: PileRowNodeTenta;

	linkToNext?: boolean;
	backfill?: boolean;

	tailExpanderRef?: RefObject<ExpanderBaseBehavior | null>;
	tailReexpand?: boolean;

	tailDecorator?: PileRowNode.TailDecorator;

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

	children?: JSX.Element

})
{

	//_$log("PileNode for " + tenta)

	tenta.use();


	let btmMargin = tenta.btmMargin();
	let { tailIsVisible, tailIsSeparated } = tenta.state;
	//let isAccented = tenta.isAccented();


	//__$log("topMargin:", topMargin);
	//__$log("btmMargin:", btmMargin);
	//___$log("next.bodyTopMargin:", tenta.next()?.bodyTopMargin());
	//___$log("parentTailBtmMargin:", tenta.parentTailBtmMargin());


	tailDecorator ??= PileRowNode.defaultTailDecorator;


	let tailMt = !tailIsVisible ? 0 : btmMargin * 12;
	let tailMb = (tailIsVisible ? 0 : btmMargin * 12) + (backfill && tailIsVisible && tailIsSeparated ? 24 : 0);


	return (

		<Tenta.ByPhaseProvider tenta={tenta}>

			<Focuser
				ref={tenta.ffRef}
				//name={`pile-node#${id}`}
				ghost
				focusable
			>

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


						<Focuser ref={tenta.tailFfRef} ghost>

							<Pane.Col

								expanderRef={tailExpanderRef}

								start={tailIsSeparated}
								expanded={tailIsVisible}
								noreexpand={!tailReexpand}

								//pt={tailMt as any}

								wrapperCls={`mt${tailMt}`}
								addExpandedHeight={tailMt + tailMb}
								pb={tailMb as any}

							//borderGreen border4
							>
								{tailDecorator(tenta)}
							</Pane.Col>

						</Focuser>


					</PileRowAccentor>

				</Div>

			</Focuser>


		</Tenta.ByPhaseProvider>
	);

}





function PileRowAccentor({
	tenta,
	children,
}: {
	tenta: PileRowNodeTenta;
	children: [body: JSX.Element, tail: JSX.Element];
})
{

	$log("PileRowAccentor " + tenta)

	//let forceUpdate = useForceUpdate();
	let [tailIsFocused, setTailIsFocused] = useState(false);


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


	useEffect(() =>

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
	children?: JSX.Element;
})
{

	let accent = Tenta.Accent.use();

	let topMargin = tenta.topMargin();
	let btmMargin = tenta.btmMargin();
	let { tailIsVisible, tailIsSeparated } = tenta.state;


	return (

		<Focuser
			ref={tenta.bodyFfRef}
			//name={`pile-row-body#${id}`}
			listener={tenta}
			autoFocus={tenta.getGlobalProp("focused") ? 200 : undefined}
		>

			<Pane.Row
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
					{tenta.toolsIsVisible ? Tenta.Details.wrap(tenta, children) : children}
					{/*<Div absolute top0 style={{left: 40} }>tailFf: {tenta.tailFf + ""}</Div>*/}
				</ErrorBoundary>

				<PileRowNodeForefill tenta={tenta} />

			</Pane.Row>

		</Focuser>

	);

}






function PileRowNodeForefill({ tenta }: { tenta: PileRowNodeTenta })
{

	let [isFocused, setIsFocused] = useState(!tenta.rootFf?.itemFocused);


	function updateFocuser(/*ff: Focuser*/)
	{

		let focused = !!tenta.bodyFf?.focused || !!tenta.tailFf?.itemFocused || !tenta.rootFf?.itemFocused;

		if (isFocused !== focused)
		{
			setIsFocused(focused);
		}

	}


	useEffect(() =>
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
		opacity0_4={!isFocused}
		animated
		nomouse
		style={{ willChange: "opacity" }}
	/>;

}






export module PileRowNode
{

	//---



	export type Props = PileRowNodeProps;

	export import Tenta = PileRowNodeTenta;


	export type TailDecorator = (tenta: Tenta_.Base) => ReactNode;




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