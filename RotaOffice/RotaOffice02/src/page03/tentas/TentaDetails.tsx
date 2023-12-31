import { $log, Div, Span, Table, Th, VR } from "@libs";
import Link from "@mui/material/Link";
import type { ReactNode } from "react";
import { isTenta, type TentaBase } from "./TentaBase";
import type { TentaPlaceholder } from "./TentaPlaceholder";
import type { TentaPlaceholderCollector } from "./TentaPlaceholderCollector";






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
								{tenta.collectorPlaceholders?.map((a, i) =>
									<CollectorPlaceholderSpan key={i} r={a} />
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
						<CollectorPlaceholderRow label="priorCollector" r={tenta.priorCollectorPlaceholder()} />
						<TentaRow indent={2} label="last" r={tenta.priorCollector()?.lastTenta()} />
						<TentaRow label="parent" r={tenta.parent} />
					</tbody>
				</Table>
			</Div>

			<Div flex250px>
				<Table details>
					<caption>next: <TentaSpan r={tenta.next()} /></caption>
					<tbody>
						<TentaRow label="nextSibling" r={tenta.nextSibling()} />
						<CollectorPlaceholderRow label="nextCollector" r={tenta.nextCollectorPlaceholder()} />
						<TentaRow indent={2} label="first" r={tenta.nextCollector()?.firstTenta()} />
						<TentaRow label="parent" r={tenta.parent} />
						<TentaRow indent={2} label="nextSibling" r={tenta.parent?.nextSibling()} />
					</tbody>
				</Table>
			</Div>

			<Div flex250px>
				<Table details>
					<caption>margin: <MarginSpan r={tenta} /></caption>
					<tbody>
						<MarginRow label="me" r={tenta.placeholder} />
						<MarginRow label="priorSibling" r={tenta.priorSiblingPlaceholder()} />
						<MarginRow indent={2} label="last" r={tenta.priorSibling()?.last()} />
						<MarginRow label="nextSibling" r={tenta.nextSiblingPlaceholder()} />
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
		r: TentaBase | TentaPlaceholder | null | undefined;
	})
	{
		return <Row indent={indent}>
			{label}
			<MarginSpan r={r} />
		</Row>;
	}


	function MarginSpan({ r }: { r: TentaBase | TentaPlaceholder | null | undefined; })
	{

		let m = !r ? null : isTenta(r) ? r.placeholder?.getMargin() : r.getMargin();

		if (!m)
			return <Span opacity3>{m}</Span>;


		return <Link onClick={() => $log("margin:", r)}>
			{m.top}-{m.bottom} / {m.tailTop}-{m.tailBottom}
		</Link>;

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


	function CollectorPlaceholderRow({
		indent = 1,
		label,
		r,
	}: {
		indent?: number;
		label: ReactNode;
		r: TentaPlaceholderCollector.CollectorPlaceholder | null | undefined;
	})
	{
		return <Row indent={indent}>
			{label}
			<CollectorPlaceholderSpan r={r} />
		</Row>;
	}


	function CollectorPlaceholderSpan({ r }: { r: TentaPlaceholderCollector.CollectorPlaceholder | null | undefined })
	{
		if (!r)
			return <Span opacity3>{r + ""}</Span>;

		return <Link onClick={() => $log("collector:", r)}>
			{r.id + ""}{r.collector ? "#" + r.collector.iid : ""}
		</Link>;
	}



}