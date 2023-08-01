import { Div, Pane } from '@libs';
import { Page01 } from './Page01';




export function App()
{

	return <>

		<Div fill overflowAutoX scrollY style={{ background: Pane.BgColor('light', 'container') }}>

			<Page01/>

		</Div>

	</>;

}
