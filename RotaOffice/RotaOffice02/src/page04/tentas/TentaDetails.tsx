import { $log, Div, Span, Table, Th, VR } from "@libs";
import Link from "@mui/material/Link";
import type { ReactNode } from "react";
import { isTenta, type TentaBase } from "./TentaBase";
import type { TentaCollector } from "./TentaCollector";






//===






export function TentaDetails({ tenta }: { tenta: TentaBase })
{

	return (

		<Div flex alignItemsStart>


			<Div flex250px>
				<Table details>
					<caption>me: #{tenta.iid}</caption>
					<tbody>
						<Row>
							<em>collectors</em>
							<VR.Stack span>
								{tenta.collectors?.map((a, i) =>
									<CollectorSpan key={i} r={a} />
								)}
							</VR.Stack>
						</Row>
						<TentaRow label="parent" r={tenta.parent} />
						<TentaRow label="first" r={tenta.first()} />
						<TentaRow label="last" r={tenta.last()} />
					</tbody>
				</Table>
			</Div>


			<Div flex250px>
				<Table details>
					<caption>prior: <TentaSpan r={tenta.prior()} /></caption>
					<tbody>
						<TentaRow label="priorSibling" r={tenta.priorSibling()} />
						<CollectorRow label="priorCollector" r={tenta.priorCollector()} />
						<TentaRow indent={2} label="last" r={tenta.priorCollector()?.last()} />
						<TentaRow label="parent" r={tenta.parent} />
					</tbody>
				</Table>
			</Div>

			<Div flex250px>
				<Table details>
					<caption>next: <TentaSpan r={tenta.next()} /></caption>
					<tbody>
						<TentaRow label="nextSibling" r={tenta.nextSibling()} />
						<CollectorRow label="nextCollector" r={tenta.nextCollector()} />
						<TentaRow indent={2} label="first" r={tenta.nextCollector()?.first()} />
						<TentaRow label="parent" r={tenta.parent} />
						<TentaRow indent={2} label="nextSibling" r={tenta.parent?.nextSibling()} />
					</tbody>
				</Table>
			</Div>

			<Div flex250px>
				<Table details>
					<caption>margin: <MarginSpan r={tenta} /></caption>
					<tbody>
						<MarginRow label="me" r={tenta} />
						<MarginRow label="priorSibling" r={tenta.priorSibling()} />
						<MarginRow indent={2} label="last" r={tenta.priorSibling()?.last()} />
						<MarginRow label="nextSibling" r={tenta.nextSibling()} />
					</tbody>
				</Table>
			</Div>

		</Div>

	);



	function Row({ indent = 1, children }: { indent?: number; children: [label: ReactNode, value: ReactNode] })
	{
		if (children[1] == null)
			return null;

		return (
			<tr>
				<Th pl={indent ? indent * 24 as any : undefined}>{children[0]}:</Th>
				<td>{children[1]}</td>
			</tr>
		);
	}



	function MarginRow({
		indent = 1,
		label,
		r,
	}: {
		indent?: number;
		label: ReactNode;
		r: TentaBase | null | undefined;
	})
	{
		return <Row indent={indent}>
			{label}
			<MarginSpan r={r} />
		</Row>;
	}


	function MarginSpan({ r }: { r: TentaBase | null | undefined; })
	{
		return null;


		//let m = r?.getMargin();

		//if (!m)
		//	return <Span opacity3>{m}</Span>;


		//return <Link onClick={() => $log("margin:", r)}>
		//	{m.top}-{m.bottom} / {m.tailTop}-{m.tailBottom}
		//</Link>;

	}



	function TentaRow({
		indent = 1,
		label,
		r,
	}: {
		indent?: number;
		label: ReactNode;
		r: TentaBase | null | undefined;
	})
	{
		return <Row indent={indent}>
			{label}
			<TentaSpan r={r} />
		</Row>;
	}


	function TentaSpan({ r }: { r: TentaBase | null | undefined })
	{
		if (!r)
			return <Span opacity3>{r + ""}</Span>;

		return <Link onClick={() => $log("tenta:", r)}>
			#{r.iid}
		</Link>;
	}


	function CollectorRow({
		indent = 1,
		label,
		r,
	}: {
		indent?: number;
		label: ReactNode;
		r: TentaCollector | null | undefined;
	})
	{
		return <Row indent={indent}>
			{label}
			<CollectorSpan r={r} />
		</Row>;
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