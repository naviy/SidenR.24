import { ErrorBoundary } from "@app";
import { Pane } from '@libs';
import clsx from "clsx";
import { Pile } from "../core";






//===






export function PileNodeTail1({

	indent = true,
	cellIndent,

	children,

	...colProps

}: Pane.ColProps & {

	indent?: boolean;
	cellIndent?: boolean;

})
{

	//let indent = indent_ !== false;


	return (

		<ErrorBoundary>

			<Pane.Col
				start end
				noreexpand
				{...colProps}
				wrapperCls={clsx(indent && "pl36 pr12", colProps.wrapperCls)}
				//border2 borderGreen
			>

				<Pile.Node.LinkLine.OptionsProvider width={indent ? 24 : 0}>

					<Pile.CellIndentProvider addIndent={cellIndent && !indent ? 24 : 0}>
						{children}
					</Pile.CellIndentProvider>

				</Pile.Node.LinkLine.OptionsProvider>

			</Pane.Col>

		</ErrorBoundary>

	);

}