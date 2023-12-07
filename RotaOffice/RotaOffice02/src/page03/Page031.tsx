import { Div, Pane, Route } from '@libs';
import FestivalIcon from '@mui/icons-material/Festival';
import Checkbox from "@mui/material/Checkbox";
import { useReducer } from "react";






//===






export module Page031
{


	export var route = Route.create({
		key: "page031",
		icon: <FestivalIcon />,
		title: "Page 031",
		content: () => <Content />,
	});


	export function Content()
	{

		return <>

			<Div mx200 m100>

				<Rows01 />

			</Div>

		</>;

	}


}






//===






function Rows01()
{

	let [exp, toggleExp] = useReducer(a => !a, false);


	return <Pane.Col start end b="md"  r="md">

		<Pane start end p12 mb24 onClick={toggleExp} cursorPointer>
			<Checkbox checked={exp} />
		</Pane>


		<Pane.Col start end>

			<Pane.Row start end={exp} r="" b="sm">
				<Pane.Row start end={exp}>
					<Pane start p12>11111</Pane>
					<Pane.Col end>
						<Pane start end={!exp} p12>222.111</Pane>
						<Pane.Col end expanded={exp} >
							<Pane start p12>222.222</Pane>
							<Pane end p12>222.333</Pane>
						</Pane.Col>
					</Pane.Col>
				</Pane.Row>
				<Pane.Col start={exp} end ml24={exp}>
					<Pane.Ghost start end r="">
						<Pane start p12>111</Pane>
						<Pane p12>222</Pane>
						<Pane end p12>333</Pane>
					</Pane.Ghost>
				</Pane.Col>
			</Pane.Row>


			<Pane.Row pl48={exp} pt24={exp} start={exp} end r="" b={exp ? "md" : "sm"}>
				<Pane.Ghost start end r={exp ? "sm" : 0}>
					<Pane start end={exp} p12>11111</Pane>
					<Pane start={exp} end={exp} ml4={exp} p12>22222</Pane>
					<Pane start={exp} ml4={exp} end p12>33333</Pane>
				</Pane.Ghost>
			</Pane.Row>

		</Pane.Col>

	</Pane.Col>;

}
