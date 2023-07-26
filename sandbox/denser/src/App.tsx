import { $log, Div, Pane, PrimitiveProps } from '@libs';
import { Box } from '@mui/material';
import { mui3 } from './@libs/components/core/mui3';




function App()
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


					<Box sx={{ padding: '1px', borderRadius: '13px', ...mui3.Elevation[3] }}>

						<Pane.Row rounded gap1>

							<Pane.Col start gapi>

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

							<Pane.Row l={2} gapi>
								<Pane.Col gapi l={150} >
									<Pane p8 center vcenter>aaa aaa aaaa</Pane>
									<Pane p8 center vcenter>bbb bbb bbbb</Pane>
									<Pane p8 center vcenter>ccc ccc cccc</Pane>
								</Pane.Col>
								<Pane p24 center vcenter>222 2222 22222 222222</Pane>
								<Pane end p24 center vcenter>333 3333 33333 333333</Pane>
							</Pane.Row>

						</Pane.Row>

					</Box>


					<Pane.Row rounded gap1 p1 e={0}>

						<Pane.Col start gapi>

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

						<Pane.Row l={2} gapi>
							<Pane.Col gapi l={150} >
								<Pane p8 center vcenter>aaa aaa aaaa</Pane>
								<Pane p8 center vcenter>bbb bbb bbbb</Pane>
								<Pane p8 center vcenter>ccc ccc cccc</Pane>
							</Pane.Col>
							<Pane p24 center vcenter>222 2222 22222 222222</Pane>
							<Pane end p24 center vcenter>333 3333 33333 333333</Pane>
						</Pane.Row>

					</Pane.Row>


					<Pane.Col gap1 rounded e={0} p1>

						<Pane.Row denseBottom>
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
						<Pane.Row gap1 my24 e={3} mx={-24} p8>
							<Pane l={300} start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane l={300} end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row gap1 my24 e={3} mx={-48} p12>
							<Pane l={300} start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane l={300} end p24>333 3333 33333 333333</Pane>
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

					</Pane.Col>


					<Pane.Col gap1>

						<Pane.Row gapi>
							<Pane.Col gapi l={150} >
								<Pane p8>aaa aaa aaaa</Pane>
								<Pane p8>bbb bbb bbbb</Pane>
								<Pane p8>ccc ccc cccc</Pane>
							</Pane.Col>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row gapi>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>

						<Pane.Row rounded denseTop gapi>
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
