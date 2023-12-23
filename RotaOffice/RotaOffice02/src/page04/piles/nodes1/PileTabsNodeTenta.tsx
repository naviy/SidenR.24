import type React from "react";
import { Tenta, type TentaInitState } from "../../tentas";
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

		//let { parent } = this;
		//return parent ? parent.opened && !this.collapsed : this.opened;

		let collapsed = stage === "collapsed";
		let opened = stage === "opened";

		return {
			bodyIsSeparated: opened,
			bodyIsAccented: !collapsed,
			tailIsVisible: !collapsed,
			tailIsSeparated: opened,
		};

	}



	//override bodyIsSeparated()
	//{
	//	let { parent } = this;
	//	return (!parent || parent.opened) && this.tailIsSeparated();
	//}


	//override tailIsVisible()
	//{
	//	return !this.collapsed;
	//}


	//override tailIsSeparated()
	//{
	//	return !this.collapsed && this.hasSeparatedItems;
	//}


	override collectorIsVisible(collector: Tenta.Collector)
	{
		return this.tailIsVisible && collector === this.collectors?.[this.activeTabIndex];
	}


	//override bodySeparate()
	//{
	//	return this.open();
	//}

	//override tailSeparate()
	//{
	//	return this.open();
	//}

	//override bodyDeseparate()
	//{
	//	return this.opened && this.expand();
	//}

	//override tailDeseparate()
	//{
	//	return this.opened && this.expand();
	//}



	//---



	override onPhaseChanged()
	{
		if (!this.collapsed)
			this.tailExpanderRef.current?.mustReexpand();
	}



	//override onTailDeseparated()
	//{
	//	this.hasSeparatedItems && this.forEachTenta(a =>
	//		a.bodyDeseparate() || a.repaintNearests()
	//	);
	//}


	//override onItemSeparated()
	//{
	//	this.tailSeparate();
	//}


	//override onItemDeseparated()
	//{
	//	!this.hasSeparatedItems && this.tailDeseparate();
	//}



	//---

}






export module PileTabsNodeTenta
{

}