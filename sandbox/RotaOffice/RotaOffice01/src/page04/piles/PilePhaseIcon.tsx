import { Div } from '@libs';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Tenta } from "../tentas";






//===






export function PilePhaseIcon({ stage }: { stage?: Tenta.Stage })
{

	stage = Tenta.Stage.use(stage);

	return <Div flex40px vcenter textCenter lineHeight1>
		<Div height24 rotate={stage === "collapsed" ? 0 : stage === "expanded" ? 45 : 90} animated>
			<ArrowForwardIosIcon />
		</Div>
	</Div>


}