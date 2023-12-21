import type React from "react";
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



	override bodyIsSeparated()
	{
		let { parent } = this;
		return (!parent || parent.opened) && this.tailIsSeparated();
	}


	override tailIsVisible()
	{
		return !this.collapsed;
	}


	override tailIsSeparated()
	{
		return !this.collapsed && this.hasSeparatedItems;
	}


	override collectorIsVisible(collector: Tenta.Collector)
	{
		return this.tailIsVisible() && collector === this.collectors?.[this.activeTabIndex];
	}



	//---



	override onPhaseChanged()
	{
		if (!this.collapsed)
			this.tailExpanderRef.current?.mustReexpand();
	}



	override onPhaseDown()
	{
		//_$log("onPhaseDown " + this)
		//this.expanded && this.forEachTenta(a =>
		//	a.collapse()// || a.repaintNearests()
		//);
	}



	override onItemPhaseUp(item: Tenta.Base)
	{
		//_$log(this + ".onItemPhaseUp " + item)
		//if (!item.collapsed && this.anyTenta(a => !a.collapsed))
		//{
		//	this.open();
		//}
	}


	override onItemPhaseDown(item: Tenta.Base)
	{
		//if (item.collapsed && this.allTentas(a => a.collapsed))
		//{
		//	this.expand();
		//}
	}



	//---

}






export module PileTabsNodeTenta
{

}