import { Pane } from '@libs';
import clsx from "clsx";
import { Tenta } from "../tentas";






//===






export type PileContainerProps = (
	(
		Tenta.PhaseTarget<"expanded"> |
		Tenta.PhaseTarget<"collapsed">
	) & {
		indent?: Tenta.PhaseTarget;
		start?: Tenta.PhaseTarget;
		end?: Tenta.PhaseTarget;
	}
);



export type PileColProps = Omit<Pane.ColProps, "expanded" | "start" | "end"> & PileContainerProps;


export function PileCol(props: PileColProps)
{

	let { expanded, collapsed, indent, start, end, ...colProps } = props as any;


	let props2 = Tenta.PhaseTarget.useConvert({ expanded, collapsed, indent, start, end });


	return <Pane.Col

		expanded={props2.expanded ?? (props2.collapsed !== true)}
		start={props2.start}
		end={props2.end}

		{...colProps}

		wrapperCls={clsx(props2?.indent && "py24 pl36 pr12", colProps.wrapperCls)}

	/>;

}