import { lighten, styled } from "@mui/material/styles";
import type { Color } from "@mui/material";
import type { TentaBase } from "../../tentas/TentaBase";
import "./PileRowNodeBackfill.scss";






//===





export var PileRowNodeBackfill = styled(
	"div",
	{
		target: "pile-row-node-backfill",
		
		shouldForwardProp: p => p !== "bg" && p !== "color" && p !== "brd" && p !== "mb" && p !== "visible",
	}
)<{
	bg?: string;
	brd?: string;
	color?: string;
	mb?: number;
	visible?: boolean;
}>(props => ({

	"--bg": props.bg,
	"--brd": props.brd,
	"--color": props.color,

	"--mb": `${props.mb}px`,
	"--op": props.visible !== false ? 1 : undefined

}));


//	export function render(tenta: TentaBase, color?: Color | null)
//	{

//		let { tailIsVisible, tailIsSeparated } = tenta;


//		return (
//			<Root
//				className="pile-row-node-backfill"
//				bg={color ? lighten(color[50], .5) : undefined}
//				brd={color ? `2px solid ${color?.[200]}` : undefined}
//				color={color?.[400]}
//				mb={tailIsVisible ? 24 : 48}
//				visible={tailIsVisible && tailIsSeparated}
//			/>
//		);

//	}


//}