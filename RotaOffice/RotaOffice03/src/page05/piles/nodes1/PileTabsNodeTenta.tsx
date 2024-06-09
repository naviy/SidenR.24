import { Tenta } from "../../tentas";
import { PileRowNode } from "./PileRowNode";






export class PileTabsNodeTenta extends PileRowNode.Tenta
{

	//---



	override init()
	{
		this.initPhase({ maxPhase: this.collectorCount });
	}



	//---



	get activeTabIndex() { return Math.max(-1, this.phase - 1); }
	get activeTabCollector() { return this.collectors?.[this.activeTabIndex] || null; }



	activateTabByIndex(tabIndex: number)
	{
		this.setPhase(tabIndex + 1);
	}



	//---



	override getRestState(stage: Tenta.Stage)
	{

		let collapsed = stage === "collapsed";
		let opened = stage === "opened";

		return {
			bodyIsSeparated: opened,
			tailIsVisible: !collapsed,
			tailIsSeparated: opened,
		};

	}



	#opened?: boolean;


	override setStage(newStage: Tenta.Stage)
	{
		this.#opened = newStage === "opened";
		return this.setPhase(this.phaseByStage(newStage));
	}


	override stageByPhase(phase: Tenta.Phase): Tenta.Stage
	{
		return (
			phase <= 0 ? "collapsed" :
				this.#opened ? "opened" :
					"expanded"
		);
	}


	override phaseByStage(stage: Tenta.Stage)
	{
		return stage === "collapsed" ? 0 : this.phase;
	}


	override collectorIsVisible(collector: Tenta.Collector)
	{
		return this.tailIsVisible && collector === this.collectors?.[this.activeTabIndex];
	}
	


	//---



	override onPhaseChanged()
	{
		if (this.expanded)
			this.tailExpanderRef.current?.mustReexpand();
	}

	

	//---

}






export module PileTabsNodeTenta
{

}