import { Pane } from '@libs';
import clsx from "clsx";
import { Pile } from "../core";






//===






export function PileNodeTail1({

	indent: indent_,
	cellIndent,

	children,

	...colProps

}: Pane.ColProps & {

	indent?: boolean;
	cellIndent?: boolean;

})
{

	let indent = indent_ !== false;


	return (
		<Pane.Col
			start end
			{...colProps}
			wrapperCls={clsx(indent && "pt24 pl36 pr12", colProps.wrapperCls)}
		>
			<Pile.Node.LinkLine.OptionsProvider width={indent ? 24 : 0}>
				<Pile.CellIndentProvider addIndent={cellIndent && !indent ? 36 : 0}>
					{children}
				</Pile.CellIndentProvider>

			</Pile.Node.LinkLine.OptionsProvider>
		</Pane.Col>
	);

}