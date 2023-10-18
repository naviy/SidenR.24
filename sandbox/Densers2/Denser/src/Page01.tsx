import { Div, Pane } from '@libs';
import { useReducer } from 'react';



export function Page01()
{

	return <>

		<Div m48>

			<Pane.Col gap48>

				<Pane.Row gapi>

					<Pane.Col flex2 rounded gap1>

						<Pane.Row>
							<Pane p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane p24>333 3333 33333 333333</Pane>
						</Pane.Row>

						<Pane.Row gap1>
							<Pane p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane p24>333 3333 33333 333333</Pane>
						</Pane.Row>

					</Pane.Col>

					<Pane.Row l={2} rounded gap1>
						<Pane.Col gapi l={150} >
							<Pane p8>aaa aaa aaaa</Pane>
							<Pane p8>bbb bbb bbbb</Pane>
							<Pane p8>ccc ccc cccc</Pane>
						</Pane.Col>
						<Pane p24>222 2222 22222 222222</Pane>
						<Pane p24>333 3333 33333 333333</Pane>
					</Pane.Row>

				</Pane.Row>



				<Pane.Row rounded gap1 p1 elevation={3}>

					<Pane.Col gapi>

						<Pane.Row>
							<Pane p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane p24>333 3333 33333 333333</Pane>
						</Pane.Row>

						<Pane.Row gapi>
							<Pane p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane p24>333 3333 33333 333333</Pane>
						</Pane.Row>

					</Pane.Col>

					<Pane.Row l={2} gapi>
						<Pane.Col gapi l={150} >
							<Pane p8 center vcenter>aaa aaa aaaa</Pane>
							<Pane p8 center vcenter>bbb bbb bbbb</Pane>
							<Pane p8 center vcenter>ccc ccc cccc</Pane>
						</Pane.Col>
						<Pane p24 center vcenter>222 2222 22222 222222</Pane>
						<Pane p24 center vcenter>333 3333 33333 333333</Pane>
					</Pane.Row>

				</Pane.Row>


				<Pane.Col gap1 rounded elevation={0} p1>

					<Pane.Row>
						<Pane p24>111 1111 11111 111111</Pane>
						<Pane p24>222 2222 22222 222222</Pane>
						<Pane p24>333 3333 33333 333333</Pane>
					</Pane.Row>

					<Pane.Row gap={1}>
						<Pane l={1} p24>111 1111 11111 111111</Pane>
						<Pane l={2} p24>222 2222 22222 222222</Pane>
						<Pane l="50%" p24>333 3333 33333 333333</Pane>
					</Pane.Row>


					<Row03 />

					<Row04 />



					<Pane.Row gap1>
						<Pane l={150} p24>111 1111 11111 111111</Pane>
						<Pane p24>222 2222 22222 222222</Pane>
						<Pane l={150} p24 textRight>333 3333 33333 333333</Pane>
					</Pane.Row>
					<Pane.Row l={100}>
						<Pane p24>111 1111 11111 111111</Pane>
						<Pane p24>222 2222 22222 222222</Pane>
						<Pane p24 textRight>333 3333 33333 333333</Pane>
					</Pane.Row>
					<Pane.Row height={100}>
						<Pane p24>111 1111 11111 111111</Pane>
						<Pane p24>222 2222 22222 222222</Pane>
						<Pane p24 textRight>333 3333 33333 333333</Pane>
					</Pane.Row>

				</Pane.Col>


				<Pane.Col gap1 rounded elevation={0} p1>

					<Pane.Row gapi>
						<Pane.Col gapi l={150} >
							<Pane p8>aaa aaa aaaa</Pane>
							<Pane p8>bbb bbb bbbb</Pane>
							<Pane p8>ccc ccc cccc</Pane>
						</Pane.Col>
						<Pane p24>222 2222 22222 222222</Pane>
						<Pane p24>333 3333 33333 333333</Pane>
					</Pane.Row>
					<Pane.Row gapi>
						<Pane p24>111 1111 11111 111111</Pane>
						<Pane p24>222 2222 22222 222222</Pane>
						<Pane p24>333 3333 33333 333333</Pane>
					</Pane.Row>

					<Pane.Row gapi>
						<Pane p24>111 1111 11111 111111</Pane>
						<Pane p24>222 2222 22222 222222</Pane>
						<Pane p24>333 3333 33333 333333</Pane>
					</Pane.Row>

				</Pane.Col>

			</Pane.Col>

		</Div>

	</>;

}



function Row03()
{

	let [expanded, toggleExpanded] = useReducer(a => !a, false);


	return <>

		<Pane.Row gap1 onClick={toggleExpanded} cursorPointer>
			<Pane l={300} p24>111 1111 11111 111111</Pane>
			<Pane p24>222 2222 22222 222222</Pane>
			<Pane l={300} p24 textRight>333 3333 33333 333333</Pane>
		</Pane.Row>

		<Pane.Row gap1 {...expanded && { rounded: true, p: 4, elevation: 3, my: 24, mx: -24 }} onClick={toggleExpanded} cursorPointer>
			<Pane l={300} p24>111 1111 11111 111111</Pane>
			<Pane p24>222 2222 22222 222222</Pane>
			<Pane l={300} p24 textRight>333 3333 33333 333333</Pane>
		</Pane.Row>

		<Pane.Row gap1 {...expanded && { rounded: true, p: 12, elevation: 3, my: 24, mx: -48 }} onClick={toggleExpanded} cursorPointer>
			<Pane l={300} p24>111 1111 11111 111111</Pane>
			<Pane p24>222 2222 22222 222222</Pane>
			<Pane l={300} p24 textRight>333 3333 33333 333333</Pane>
		</Pane.Row>

	</>;

}


function Row04()
{

	let [expanded, toggleExpanded] = useReducer(a => !a, false);


	return <>

		<Pane.Row gap1 {...expanded && { rounded: true, p: 2, elevation: 3, mx: -24, my: 24 }} onClick={toggleExpanded} cursorPointer>

			<Pane.Col gapi>

				<Pane.Row>
					<Pane p24>111 1111 11111 111111</Pane>
					<Pane p24>222 2222 22222 222222</Pane>
					<Pane p24 textRight>333 3333 33333 333333</Pane>
				</Pane.Row>

				<Pane.Row gapi>
					<Pane p24 l={180}>111 1111 11111 111111</Pane>
					<Pane p24 l={180}>222 2222 22222 222222</Pane>
					<Pane p24 l={180} textRight>333 3333 33333 333333</Pane>
				</Pane.Row>

			</Pane.Col>

			<Pane.Row gapi l={2}>
				<Pane.Col gapi l={150}>
					<Pane p8 center vcenter>aaa aaa aaaa</Pane>
					<Pane p8 center vcenter>bbb bbb bbbb</Pane>
					<Pane p8 center vcenter>ccc ccc cccc</Pane>
				</Pane.Col>
				<Pane p24 vcenter>222 2222 22222 222222</Pane>
				<Pane p24 textRight vcenter>333 3333 33333 333333</Pane>
			</Pane.Row>

		</Pane.Row>


		<Pane.Row gap1>

			<Pane.Col gapi>

				<Pane.Row>
					<Pane p24>111 1111 11111 111111</Pane>
					<Pane p24>222 2222 22222 222222</Pane>
					<Pane p24 textRight>333 3333 33333 333333</Pane>
				</Pane.Row>

				<Pane.Row gapi>
					<Pane l={180} p24>111 1111 11111 111111</Pane>
					<Pane l={180} p24>222 2222 22222 222222</Pane>
					<Pane l={180} p24 textRight>333 3333 33333 333333</Pane>
				</Pane.Row>

			</Pane.Col>

			<Pane.Row l={2} gapi>
				<Pane.Col gapi l={150} >
					<Pane p8 center vcenter>aaa aaa aaaa</Pane>
					<Pane p8 center vcenter>bbb bbb bbbb</Pane>
					<Pane p8 center vcenter>ccc ccc cccc</Pane>
				</Pane.Col>
				<Pane p24 vcenter>222 2222 22222 222222</Pane>
				<Pane p24 textRight vcenter>333 3333 33333 333333</Pane>
			</Pane.Row>

		</Pane.Row>

	</>;

}