import { Pane } from '@libs';
import clsx from "clsx";
import { Pile } from "../core";






//===






export function PileNodeTail1({

	indent: indent_,

	children,

	...colProps

}: Pane.ColProps & {

	indent?: boolean;

})
{

	let indent = indent_ !== false;


	return (
		<Pane.Col
			start end
			{...colProps}
			wrapperCls={clsx(indent && "pt24 pl48 pr24", colProps.wrapperCls)}
		>
			<Pile.Node.LinkLine.OptionsProvider
				width={indent ? 24 : 0}
				children={children}
			/>
		</Pane.Col>
	);

}