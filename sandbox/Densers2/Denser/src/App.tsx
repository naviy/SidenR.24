import { Focuser } from '@libs';
import { Page03 } from './page03';




export function App()
{

	//useEffect(() => Focuser.runCore(), []);


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
