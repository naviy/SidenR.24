import { Pane } from '@libs';
import clsx from "clsx";






//===






export function PileTailCol({
	indent,
	...colProps
}: Pane.ColProps & {

	indent?: boolean;

})
{
	return <Pane.Col
		{...colProps}
		wrapperCls={clsx(indent && "pt24 pl60 pr36", colProps.wrapperCls)}
	/>;
}