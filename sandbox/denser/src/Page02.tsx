import { Div, Focuser, Pane } from '@libs';
import { useReducer } from 'react';
import { Block } from './@libs/components/pane/Bock';



export function Page02()
{

	return <>

		<Pane.Col m48 rounded e={0} p1 gap1>

			<Row03 start />
			<Row03 />
			<Row03 />

			<Row04 />
			<Row04 />
			<Row04 />
			<Row04 end />

		</Pane.Col>

	</>;

}



function Row03(props: Block.Props)
{

	let [expanded, toggleExpanded] = useReducer(a => !a, false);


	return <>

		<Focuser
			onClick={async (ff) => { !ff.isFocused ? await ff.focus() : toggleExpanded() }}
		>
			<Pane.Row {...props} gap1 {...expanded && { rounded: true, p: 2, e: 3, my: 24, mx: -24 }} cursorPointer>

				<Focuser.Caret />

				<Pane l={300} p24>111 1111 11111 111111</Pane>
				<Pane p24>222 2222 22222 222222</Pane>
				<Pane l={300} p24 textRight>333 3333 33333 333333</Pane>

			</Pane.Row>
		</Focuser>

	</>;

}


function Row04(props: Block.Props)
{

	let [expanded, toggleExpanded] = useReducer(a => !a, false);


	return <>

		<Focuser
			onClick={async (ff) => { !ff.isFocused ? await ff.focus() : toggleExpanded() }}
		>

			<Pane.Row
				{...props}
				gap1
				{...expanded && { rounded: true, p: 2, e: 3, mx: -24, my: 24 }}
				cursorPointer
			>

				<Focuser.Caret />

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

		</Focuser>

	</>;

}