import { ErrorBoundary } from "@app";
import { Pane } from '@libs';
import clsx from "clsx";
import type { Tenta } from "../../tentas";






//===






export function GroupAreaNodeTail({

	collector,

	children,

	...colProps

}: Pane.ColProps & {

	collector: Tenta.Collector;

})
{


	let isSeparated = collector.isSeparated();


	return (

		<ErrorBoundary>

			<Pane.Col

				start
				end

				rt={isSeparated ? "lg" : undefined}
				rb={isSeparated ? "lg" : undefined}

				{...colProps}

				wrapperCls={clsx(`px36`, colProps.wrapperCls)}
			>

				{children}

			</Pane.Col>

		</ErrorBoundary>

	);

}