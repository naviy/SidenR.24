import { Focuser, Pane } from '@libs';
import { PileNode1Behavior } from "./PileNode1_Behavior";






//===






export function PileNodeRow1({
	tenta,
	...rowProps
}: Pane.RowProps & {
	tenta: PileNode1Behavior;
})
{

	let { collapsed, expanded, opened, isFirst, isLast, topStage, btmStage, placeholder } = tenta;

	return (


		<Pane.Row

			start
			end

			bl={!collapsed ? "lg" : undefined}
			br={!collapsed ? "lg" : undefined}
			bt={!collapsed ? "lg" : !isFirst && collapsed && !placeholder!.prior!.collapsed ? "md" : undefined}
			bb={!collapsed ? "lg" : !isLast && collapsed && !placeholder!.next!.collapsed ? "md" : undefined}
			rt={collapsed && !isFirst && !placeholder!.prior!.collapsed ? "xs" : expanded && !isFirst ? "sm" : undefined}
			rb={collapsed && !isLast && !placeholder!.next!.collapsed ? "xs" : expanded && !isLast ? "sm" : undefined}

			e={opened ? "L1" : expanded ? "L2" : btmStage === "expanded" ? "L3b" : btmStage === "opened" ? "L2b" : topStage === "expanded" ? "L3t" : topStage === "opened" ? "L2t" : "0"}

			{...rowProps }

			ff

		>

			{rowProps.children}

		</Pane.Row>

	);

}