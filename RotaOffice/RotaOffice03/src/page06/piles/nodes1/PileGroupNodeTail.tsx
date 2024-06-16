import { ErrorBoundary } from "@app";
import { $log, Pane } from '@libs';
import clsx from "clsx";
import type { Tenta } from "../../tentas";
import { Pile } from "../core";






//===






export function GroupAreaNodeTail({

	collector,

	indent,
	cellIndent,

	children,

	...colProps

}: Pane.ColProps & {

	collector: Tenta.Collector;
	indent?: boolean;
	cellIndent?: boolean;

})
{


	let parentCellIndent = Pile.useCellIndent();


	let isSeparated = collector.isSeparated();

	indent ??= isSeparated;

	let myIndent = !indent ? 36 : 0;


	return (

		<ErrorBoundary>

			<Pane.Col

				start
				end

				rt={isSeparated ? "lg" : undefined}
				rb={isSeparated ? "lg" : undefined}
				bt={isSeparated ? "md" : undefined}
				bb={isSeparated ? "md" : undefined}

				{...colProps}

				//wrapperCls={clsx(/*"borderRed",*/ indent && `pl${parentCellIndent + 36} pr12`, colProps.wrapperCls)}
				wrapperCls={clsx(/*"borderRed",*/ indent && `pl${36} pr12`, colProps.wrapperCls)}

			//border2 borderGreen
			>

				<Pile.Node.LinkLine.OptionsProvider width={indent ? 21 : 0}>

					<Pile.CellIndentProvider indent={!cellIndent ? 0 : parentCellIndent + myIndent}>
					{/*<Pile.CellIndentProvider indent={cellIndent && !indent ? parentCellIndent + 36 : 0}>*/}
						{children}
					</Pile.CellIndentProvider>

				</Pile.Node.LinkLine.OptionsProvider>

			</Pane.Col>

		</ErrorBoundary>

	);

}