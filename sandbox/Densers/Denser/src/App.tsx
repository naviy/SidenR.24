import { Div, Focuser, Pane } from '@libs';
import { useEffect } from 'react';
import { Page01 } from './Page01';
import { Page02 } from './page02';




export function App()
{

	useEffect(() => Focuser.runCore(), []);


	return <>

		<Focuser root cursor ghost click="unfocus">

			<Div fill overflowAutoX scrollY style={{ background: Pane.BgColor('light', 'container') }}>

				<Page02 />

			</Div>

		</Focuser>

	</>;

}
