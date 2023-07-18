import { GlobalStylesOfPrimitives, Div, Pane } from '@libs';




function App()
{

	return <>

		<GlobalStylesOfPrimitives />

		<Div fill overflowAutoX scrollY style={{ background: Pane.BgColor('light', 'background') }}>

			<Div m24>

				<Pane.Col gap24>

					<Pane.Row gapi>

						<Pane.Col gap1 flex2>

							<Pane.Row denseBottom>
								<Pane start p24>111 1111 11111 111111</Pane>
								<Pane p24>222 2222 22222 222222</Pane>
								<Pane end p24>333 3333 33333 333333</Pane>
							</Pane.Row>

							<Pane.Row gap1 denseTop flex1>
								<Pane start p24>111 1111 11111 111111</Pane>
								<Pane p24>222 2222 22222 222222</Pane>
								<Pane end p24>333 3333 33333 333333</Pane>
							</Pane.Row>

						</Pane.Col>

						<Pane.Col gap4 flex1>

							<Pane.Row denseBottom>
								<Pane start p24>111 1111 11111 111111</Pane>
								<Pane p24>222 2222 22222 222222</Pane>
								<Pane end p24>333 3333 33333 333333</Pane>
							</Pane.Row>

							<Pane.Row gapi denseTop>
								<Pane start p24>111 1111 11111 111111</Pane>
								<Pane p24>222 2222 22222 222222</Pane>
								<Pane end p24>333 3333 33333 333333</Pane>
							</Pane.Row>

						</Pane.Col>


					</Pane.Row>

					<Pane.Col gap1>

						<Pane.Row denseBottom>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>

						<Pane.Row dense gap={1}>
							<Pane l={1} start p24>111 1111 11111 111111</Pane>
							<Pane l={2}p24>222 2222 22222 222222</Pane>
							<Pane l="50%" end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row dense gap1>
							<Pane l={300} start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane l={300} end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row dense gap1>
							<Pane l={150} start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane l={150} end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row dense>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row dense>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row dense>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>
						<Pane.Row dense>
							<Pane start p24>111 1111 11111 111111</Pane>
							<Pane p24>222 2222 22222 222222</Pane>
							<Pane end p24>333 3333 33333 333333</Pane>
						</Pane.Row>

						<Pane.Row gap1 denseTop>
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
