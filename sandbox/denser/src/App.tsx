import { Div, Focuser, Pane } from '@libs';
import { useEffect } from 'react';
import { Page01 } from './Page01';
import { Page02 } from './page02';




export function App()
{

	useEffect(() => Focuser.runCore(), []);


	return <>

		<Div fill overflowAutoX scrollY style={{ background: Pane.BgColor('light', 'container') }}>

			<Focuser root cursor ghost click="unfocus">

				<Page02 />

			</Focuser>

		</Div>

	</>;

}
