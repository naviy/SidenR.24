import { $log, Div, Pane, PrimitiveProps } from '@libs';
import { Box } from '@mui/material';
import { useReducer } from 'react';
import { mui3 } from './@libs/components/core/mui3';




export function App()
{

	let ps1 = PrimitiveProps.getPaddings({ gap1: true, p8: true } as any)


	return <>

		<Div fill overflowAutoX scrollY style={{ background: Pane.BgColor('light', 'container') }}>

			<Div m48>

				<Pane.Col gap48>

					<Pane.Col gap1 p1 e={0}>
						<Row04 />
						<Row04 />
					</Pane.Col>

					<Row041 />

				</Pane.Col>

			</Div>

		</Div>

	</>;

}



export function App1()
{

	let ps1 = PrimitiveProps.getPaddings({ gap1: true, p8: true } as any)
	$log("ps1:", ps1);


	return <>

		<Div fill overflowAutoX scrollY style={{ background: Pane.BgColor('light', 'container') }}>

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



					<Pane.Row rounded gap1 p1 e={3}>

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


					<Pane.Col gap1 rounded e={0} p1>

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


						<Pane.Row gap1 >

							<Pane.Col gapi>

								<Pane.Row>
									<Pane p24>111 1111 11111 111111</Pane>
									<Pane p24>222 2222 22222 222222</Pane>
									<Pane p24 textRight>333 3333 33333 333333</Pane>
								</Pane.Row>

								<Pane.Row gapi>
									<Pane p24>111 1111 11111 111111</Pane>
									<Pane p24>222 2222 22222 222222</Pane>
									<Pane p24 textRight>333 3333 33333 333333</Pane>
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


					<Pane.Col gap1 rounded e={0} p1>

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

		<Pane.Row gap1 {...expanded && { rounded: true, p: 4, e: 3, my: 24, mx: -24 }} onClick={toggleExpanded} cursorPointer>
			<Pane l={300} p24>111 1111 11111 111111</Pane>
			<Pane p24>222 2222 22222 222222</Pane>
			<Pane l={300} p24 textRight>333 3333 33333 333333</Pane>
		</Pane.Row>

		<Pane.Row gap1 {...expanded && { rounded: true, p: 12, e: 3, my: 24, mx: -48 }} onClick={toggleExpanded} cursorPointer>
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

		<Pane.Row gap1 {...expanded && { rounded: true, p: 2, e: 3, mx: -24 }} onClick={toggleExpanded} cursorPointer>

			<Pane.Col gapi>

				<Pane.Row>
					<Pane p24>111 1111 11111 111111</Pane>
					<Pane p24>222 2222 22222 222222</Pane>
					<Pane p24 textRight>333 3333 33333 333333</Pane>
				</Pane.Row>

				<Pane.Row gapi>
					<Pane p24>111 1111 11111 111111</Pane>
					<Pane p24>222 2222 22222 222222</Pane>
					<Pane p24 textRight>333 3333 33333 333333</Pane>
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


function Row041()
{

	let [expanded, toggleExpanded] = useReducer(a => !a, false);


	return <>

		<Pane.Col e={0} gap1 p8 rounded>

			<Pane.Row gap1 {...expanded && { rounded: true, p: 2, e: 3, my: 24, mx: -24 }} onClick={toggleExpanded} cursorPointer>
				<Pane.Col gapi>
					<Pane.Row>
						<Pane p24>111 1111 11111 111111</Pane>
					</Pane.Row>
				</Pane.Col>
				<Pane p8 center vcenter>aaa aaa aaaa</Pane>
			</Pane.Row>

			<Pane.Row gap1 {...expanded && { rounded: true, p: 2, e: 3, my: 24, mx: -24 }} onClick={toggleExpanded} cursorPointer>
				<Pane.Col gapi>
					<Pane p24>111 1111 11111 111111</Pane>
				</Pane.Col>
				<Pane p8 center vcenter>aaa aaa aaaa</Pane>
			</Pane.Row>

		</Pane.Col>

	</>;

}