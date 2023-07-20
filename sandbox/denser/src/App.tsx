import { Div, Pane } from '@libs';




function App()
{

	//return <>

	//	<Div fill overflowAutoX scrollY style={{ background: Pane.BgColor('light', 'background') }}>

	//		<Div m24>

	//			<Pane.Row gap24>

	//				<Pane.Col flex2 rounded gap1>

	//					<Pane.Row>
	//						<Pane p24>111 1111 11111 111111</Pane>
	//						<Pane p24>222 2222 22222 222222</Pane>
	//						<Pane p24>333 3333 33333 333333</Pane>
	//					</Pane.Row>

	//					<Pane.Row gap1>
	//						<Pane p24>111 1111 11111 111111</Pane>
	//						<Pane p24>222 2222 22222 222222</Pane>
	//						<Pane p24>333 3333 33333 333333</Pane>
	//					</Pane.Row>

	//				</Pane.Col>

	//				<Pane.Row l={2} rounded gap1>
	//					<Pane.Col gapi l={150}>
	//						<Pane p12 vcenter>aaa aaa aaaa</Pane>
	//						<Pane p12 vcenter>bbb bbb bbbb</Pane>
	//						<Pane p12 vcenter>ccc ccc cccc</Pane>
	//					</Pane.Col>
	//					<Pane p24 vcenter>222 2222 22222 222222</Pane>
	//					<Pane p24 vcenter>333 3333 33333 333333</Pane>
	//				</Pane.Row>

	//			</Pane.Row>

	//		</Div>

	//	</Div>

	//</>;

	return <>

		<Div fill overflowAutoX scrollY style={{ background: Pane.BgColor('light', 'background') }}>

			<Div m24>

				<Pane.Col gap24>

					<Pane.Row gapi>

						<Pane.Col flex2 rounded gap1>

							<Pane.Row>
								<Pane p24>111 1111 11111 111111</Pane>
								<Pane p24>222 2222 22222 222222</Pane>
								<Pane p24>333 3333 33333 333333</Pane>
							</Pane.Row>

							<Pane.Row gap1>
								<Pane start p24>111 1111 11111 111111</Pane>
								<Pane p24>222 2222 22222 222222</Pane>
								<Pane end p24>333 3333 33333 333333</Pane>
							</Pane.Row>

						</Pane.Col>

						<Pane.Row l={2} rounded gap1>
							<Pane.Col gapi l={150} >
								<Pane p8>aaa aaa aaaa</Pane>
								<Pane p8>bbb bbb bbbb</Pane>
								<Pane p8>ccc ccc cccc</Pane>
							</Pane.Col>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>

					</Pane.Row>


					<Pane.Row rounded gap8>

						<Pane.Col start gap1>

							<Pane.Row>
								<Pane start p24>111 1111 11111 111111</Pane>
								<Pane p24>222 2222 22222 222222</Pane>
								<Pane end p24>333 3333 33333 333333</Pane>
							</Pane.Row>

							<Pane.Row gapi>
								<Pane start p24>111 1111 11111 111111</Pane>
								<Pane p24>222 2222 22222 222222</Pane>
								<Pane end p24>333 3333 33333 333333</Pane>
							</Pane.Row>

						</Pane.Col>

						<Pane.Row l={2} gap1>
							<Pane.Col gapi l={150} >
								<Pane p8 center vcenter>aaa aaa aaaa</Pane>
								<Pane p8 center vcenter>bbb bbb bbbb</Pane>
								<Pane p8 center vcenter>ccc ccc cccc</Pane>
							</Pane.Col>
							<Pane p24 center vcenter>222 2222 22222 222222</Pane>
							<Pane end p24 center vcenter>333 3333 33333 333333</Pane>
						</Pane.Row>

					</Pane.Row>


					<Pane.Col gap1>

						<Pane.Row rounded denseBottom>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>

						<Pane.Row gap={1}>
							<Pane l={1} start p24>111 1111 11111 111111</Pane>
							<Pane l={2} p24>222 2222 22222 222222</Pane>
							<Pane l="50%" end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row gap1>
							<Pane l={300} start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane l={300} end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row gap1>
							<Pane l={150} start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane l={150} end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row l={100}>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row height={100}>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row gap1>
							<Pane.Col gapi l={150} >
								<Pane p8>aaa aaa aaaa</Pane>
								<Pane p8>bbb bbb bbbb</Pane>
								<Pane p8>ccc ccc cccc</Pane>
							</Pane.Col>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>

						<Pane.Row  rounded denseTop gap1>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>

					</Pane.Col>

				</Pane.Col>

			</Div>

		</Div>

	</>;

}



export default App;
