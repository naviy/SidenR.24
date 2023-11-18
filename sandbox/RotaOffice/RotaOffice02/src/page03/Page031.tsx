import { Div, Pane, Route } from '@libs';
import FestivalIcon from '@mui/icons-material/Festival';
import Checkbox from "@mui/material/Checkbox";
import { useReducer } from "react";






//===






export module Page031
{


	export const route = Route.create({
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


	return <>
		<Pane p12 mb24 onClick={toggleExp} cursorPointer>
			<Checkbox checked={exp} />
		</Pane>


		<Pane.Col start end b="2" r="3">

			<Pane.Row start end={exp} r="" b="1">
				<Pane.Row start end={exp}>
					<Pane.Col start>
						<Pane start end={!exp} p12>111.111</Pane>
						<Pane.Col end expanded={exp} >
							<Pane start p12>111.222</Pane>
							<Pane end p12>111.333</Pane>
						</Pane.Col>
					</Pane.Col>
					<Pane end p12>22222</Pane>
				</Pane.Row>
				<Pane.Col start={exp} end ml24={exp}>
					<Pane.Ghost start end r="0">
						<Pane start p12>111</Pane>
						<Pane p12>222</Pane>
						<Pane end p12>333</Pane>
					</Pane.Ghost>
				</Pane.Col>
			</Pane.Row>


			<Pane.Row pl48={exp} pt24={exp} start={exp} end r="" b={exp ? "2" : "1"}>
				<Pane.Ghost start end r={exp ? "1" : 0}>
					<Pane start end={exp} p12>11111</Pane>
					<Pane start={exp} end={exp} ml4={exp} p12>22222</Pane>
					<Pane start={exp} ml4={exp} end p12>33333</Pane>
				</Pane.Ghost>
			</Pane.Row>

		</Pane.Col>

	</>;

}
