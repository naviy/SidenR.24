import { GlobalState } from "@libs";
import type React from "react";
import type { TentaBase, TentaGlobalState } from "./TentaBase";
import { TentaPlaceholderCollector } from "./TentaPlaceholderCollector";
import { TentaStage } from "./TentaStage";
import { TentaDescriptor } from "./TentaDescriptor";






//===






export class TentaPlaceholder
{


	//---



	constructor(
		public collector: TentaPlaceholderCollector,
		props: TentaPlaceholder.DefaultProps
	)
	{
		this.id=props.id;
		this.descriptor = props.descriptor;
		this.stage = props.defaultStage || TentaStage.Default;
		//$log("create Placeholder")
	}


	use(tenta: TentaBase)
	{
		this.tenta = tenta;
		return this;
	}



	//---



	id: React.Key;
	stage: TentaStage;
	descriptor: TentaDescriptor;

	tenta?: TentaBase;

	prior: TentaPlaceholder | null = null;
	next: TentaPlaceholder | null = null;

	get collapsed() { return this.stage === "collapsed"; }
	get expanded() { return this.stage === "expanded"; }
	get opened() { return this.stage === "opened"; }



	//---



	globalState?: TentaGlobalState;



	setGlobalState(value: TentaGlobalState)
	{

		this.globalState = value;

		this.#loadFromGlobalState();

	}



	#loadFromGlobalState()
	{
		if (!this.globalState) return;

		this.stage = GlobalState.get(this.globalState, 'stage', this.stage)!;
	}



	#saveToGlobalState()
	{
		if (!this.globalState) return;


		GlobalState.set(this.globalState, 'stage', this.stage, TentaStage.Default)!;
	}




	//---



	useTenta(tenta: TentaBase)
	{
		//if (this.tenta && this.tenta !== tenta)
		//{
		//	throw Error(`Tenta.Placeholder.CollectorBehavior: по ключу ${this.id} уже зарегистрирован placeholder с другой tenta`)
		//}

		this.tenta = tenta;

	}



	//---



	setProps(props: Partial<TentaPlaceholder.Props>)
	{
		if (props.stage !== undefined)
		{
			this.stage = props.stage;
			this.#saveToGlobalState();
		}
	}


	set(props: Partial<TentaPlaceholder.Props>)
	{
		this.setProps(props);
		this.collector.repaint();
	}



	//---



	getMargin()
	{
		return TentaDescriptor.Margin(this.descriptor.getMargin(this));
	}



	//---


}






export module TentaPlaceholder
{


	//---




	export function use(
		id: React.Key | undefined,
		collector?: TentaPlaceholderCollector | null
	): TentaPlaceholder | undefined
	{

		if (id === undefined)
			return undefined;

		if (collector === undefined)
			collector = TentaPlaceholderCollector.use();


		if (!collector)
			return undefined;


		let exist = collector.byId(id);

		if (exist)
			return exist;


		throw Error(`Tenta.Placeholder.use(): попытка использовать tenta с ключом '${id}', который не был зарегистрирован в Tenta.Placeholder.Collector`)

	}




	//---




	export interface Props
	{
		stage: TentaStage;
	}



	export type DefaultProps = {

		descriptor: TentaDescriptor;

		id: React.Key;

		defaultStage?: TentaStage;

	};


	export type DefaultPropsAlias = DefaultProps | [

		descriptor: TentaDescriptor,

		id: React.Key,

		cfg?: Omit<DefaultProps, "id" | "descriptor">

	];



	export function DefaultProps(props: DefaultPropsAlias): DefaultProps
	{
		if (Array.isArray(props))
		{
			return {
				descriptor: props[0],
				id: props[1],
				...props[2],
			};
		}

		return props;
	}



	//---


}