import { Div, Focuser, Pane } from '@libs';
import { useEffect } from 'react';
import { Page01 } from './Page01';
import { Page02 } from './page02';
import { Page03 } from './page03';




export function App()
{

	useEffect(() => Focuser.runCore(), []);


	return <>

		<Focuser root cursor ghost click="unfocus">

			<Div fill overflowAutoX scrollY style={{ background: Pane.BgColor('light', 'background') }}>

				<Page03 />

			</Div>

		</Focuser>

	</>;

}
