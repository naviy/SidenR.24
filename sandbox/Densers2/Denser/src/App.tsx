import { Div, Focuser, Pane } from '@libs';
import { useEffect } from 'react';
import { Page01 } from './Page01';
import { Page02 } from './page02';
import { Page03 } from './page03';




export function App()
{

	useEffect(() => Focuser.runCore(), []);


	return <>

		<Focuser root ghost click="unfocus">

			{/*<Div fill overflowAutoX scrollY bgBlueGrey200>*/}

			{/*	<Focuser cursor ghost>*/}
					<Page03 />
			{/*	</Focuser>*/}

			{/*</Div>*/}

		</Focuser>

	</>;

}
