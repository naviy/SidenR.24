import { $log, Div, Pane, Span, Table, Th, VR } from "@libs";
import Link from "@mui/material/Link";
import type { ReactNode } from "react";
import { type TentaBase } from "./TentaBase";
import type { TentaCollector } from "./TentaCollector";






//===






export function TentaDetails({ tenta }: { tenta: TentaBase })
{

	//___$log("TentaDetails " + tenta)

	//let ppp = tenta.parentTailBtmMargin();

	return (

		<Div flex alignItemsStart>


			<Div flex250px>
				<Table details>
					<caption>me: #{tenta.iid}</caption>
					<tbody>
						<Row label="phase" r={tenta.phase} />
						<Row
							label={<em>collectors</em>}
							r={<VR.Stack span>
								{tenta.collectors?.map((a, i) =>
									<CollectorSpan key={i} r={a} />
								)}
							</VR.Stack>}
						/>
						<TentaRow label="parent" r={tenta.parentTenta} />
						<TentaRow label="first" r={tenta.firstVisibleTenta()} />
						<TentaRow label="last" r={tenta.lastVisibleTenta()} />
						<BoolRow label="bodyIsSeparated" r={tenta.bodyIsSeparated} />
						<BoolRow label="tailIsSeparated" r={tenta.tailIsSeparated} />
						<BoolRow label="hasSeparatedItems" r={tenta.hasSeparatedItems} />
					</tbody>
				</Table>
			</Div>


			{/*<Div flex200px>*/}
			{/*	<Table details>*/}
			{/*		<caption>isAccented: {tenta.accent() + ""}</caption>*/}
			{/*		<tbody>*/}
			{/*			<BoolRow label="bodyIsAccented" r={tenta.bodyIsAccented} />*/}
			{/*			<CollectorRow label="parentCollector" r={tenta.parentCollector} />*/}
			{/*			<BoolRow indent label="isVisible" r={tenta.parentCollector?.isVisible()} />*/}
			{/*			<BoolRow indent label="isSeparated" r={tenta.parentCollector?.isSeparated()} />*/}
			{/*			<TentaRow label="parent" r={tenta.parent} />*/}
			{/*			<BoolRow label="isAccented" r={tenta.parent?.accent()} />*/}
			{/*		</tbody>*/}
			{/*	</Table>*/}
			{/*</Div>*/}


			<Div flex250px>
				<Table details>
					<caption>topMargin: {tenta.topMargin()}</caption>
					<tbody>
						<Row label="bodyTopMargin" r={tenta.bodyTopMargin()} />
						<TentaRow label="prior" r={tenta.prior()} />
						<Row indent label="btmMargin" r={tenta.prior()?.btmMargin()} />
					</tbody>
				</Table>
			</Div>


			<Div flex250px>
				<Table details>
					<caption>btmMargin: {tenta.btmMargin()}</caption>
					<tbody>
						<Row label="bodyBtmMargin" r={tenta.bodyBtmMargin()} />
						<Row label="stageIndex" r={tenta.stageIndex} />
						<TentaRow label="next" r={tenta.next()} />
						<Row indent label="bodyTopMargin" r={tenta.next()?.bodyTopMargin()} />
						<Row label="parentTailBtmMargin" r={tenta.parentTailBtmMargin()} />
						<TentaRow indent label="parent" r={tenta.parentTenta} />
						<Row indent={2} label="parentTailBtmMargin" r={tenta.parentTenta?.parentTailBtmMargin()} />
						<Row indent={3} label="tailBtmMargin" r={tenta.parentTenta?.tailBtmMargin()} />
						<Row indent={3} label="bodyBtmMargin" r={tenta.parentTenta?.bodyBtmMargin()} />
						<TentaRow indent label="parent2" r={tenta.parentTenta?.parentTenta} />
						<Row indent={2} label="parentTailBtmMargin" r={tenta.parentTenta?.parentTenta?.parentTailBtmMargin()} />
						<Row indent={3} label="tailBtmMargin" r={tenta.parentTenta?.parentTenta?.tailBtmMargin()} />
						<Row indent={3} label="bodyBtmMargin" r={tenta.parentTenta?.parentTenta?.bodyBtmMargin()} />
					</tbody>
				</Table>
			</Div>


			<Div flex250px>
				<Table details>
					<caption>prior: <TentaSpan r={tenta.prior()} /></caption>
					<tbody>
						<TentaRow label="priorSibling" r={tenta.priorSibling()} />
						<TentaRow indent label="last" r={tenta.priorSibling()?.lastVisibleTenta()} />
						<CollectorRow label="priorCollector" r={tenta.priorCollector()} />
						<TentaRow indent label="last" r={tenta.priorCollector()?.last()} />
						<TentaRow label="parent" r={tenta.parentTenta} />
					</tbody>
				</Table>
			</Div>

			<Div flex250px>
				<Table details>
					<caption>next: <TentaSpan r={tenta.next()} /></caption>
					<tbody>
						<TentaRow label="nextSibling" r={tenta.nextSibling()} />
						<CollectorRow label="nextCollector" r={tenta.nextCollector()} />
						<TentaRow indent label="first" r={tenta.nextCollector()?.first()} />
						<TentaRow label="parent" r={tenta.parentTenta} />
						<TentaRow indent label="nextSibling" r={tenta.parentTenta?.nextSibling()} />
					</tbody>
				</Table>
			</Div>


		</Div>

	);



	function Row({
		indent,
		label,
		r,
	}: {
		indent?: boolean | number;
		label: ReactNode;
		r: ReactNode;
	})
	{
		if (r == null)
			return null;

		return (
			<tr>
				<Th pl={typeof indent === "number" ? indent * 24 + 24 as any : indent === true ? 48 : 18}>{label}:</Th>
				<td>{r}</td>
			</tr>
		);
	}



	function EmptyRow()
	{
		return (
			<tr>
				<td>&nbsp;</td>
				<td>&nbsp;</td>
			</tr>
		);
	}



	//function MarginRow({
	//	indent,
	//	label,
	//	r,
	//}: {
	//	indent?: boolean;
	//	label: ReactNode;
	//	r: TentaBase | null | undefined;
	//})
	//{
	//	return <Row indent={indent} label={label} r={<MarginSpan r={r} />} />;
	//}


	//function MarginSpan({ r }: { r: TentaBase | null | undefined; })
	//{
	//	return null;


	//	//let m = r?.getMargin();

	//	//if (!m)
	//	//	return <Span opacity3>{m}</Span>;


	//	//return <Link onClick={() => $log("margin:", r)}>
	//	//	{m.top}-{m.bottom} / {m.tailTop}-{m.tailBottom}
	//	//</Link>;

	//}



	function BoolRow({
		indent,
		label,
		r,
	}: {
		indent?: boolean | number;
		label: ReactNode;
		r: boolean | null | undefined;
	})
	{
		return <Row indent={indent} label={label} r={<BoolSpan r={r} />} />;
	}


	function BoolSpan({ r }: { r: boolean | null | undefined })
	{
		if (r == null)
			return <Span opacity3>{r + ""}</Span>;

		return r ? "true" : "false";
	}


	function TentaRow({
		indent,
		label,
		r,
	}: {
		indent?: boolean | number;
		label: ReactNode;
		r: TentaBase | null | undefined;
	})
	{
		return <Row indent={indent} label={label} r={<TentaSpan r={r} />} />;
	}


	function TentaSpan({ r }: { r: TentaBase | null | undefined })
	{
		if (!r)
			return <Span opacity3>{r + ""}</Span>;

		let r2 = { ...r };

		return <Link onClick={() => $log("tenta:", r2)}>
			##{r.iid}
		</Link>;
	}


	function CollectorRow({
		indent,
		label,
		r,
	}: {
		indent?: boolean | number;
		label: ReactNode;
		r: TentaCollector | null | undefined;
	})
	{
		return <Row indent={indent} label={label} r={<CollectorSpan r={r} />} />;
	}


	function CollectorSpan({ r }: { r: TentaCollector | null | undefined })
	{
		if (!r)
			return <Span opacity3>{r + ""}</Span>;

		return <Link onClick={() => $log("collector:", r)}>
			{r.id + ""}{"#" + r.iid}
		</Link>;
	}



}





export module TentaDetails
{


	export var visible = true;
	//export var visible = false;



	export function wrap(tenta: TentaBase, children: ReactNode)
	{

		if (!visible)
			return children;


		return (
			<Pane.Col start end>
				<Pane.Row start end>
					{children}
				</Pane.Row>
				<div>
					<TentaDetails tenta={tenta} />
				</div>
			</Pane.Col>

		);

	}

}