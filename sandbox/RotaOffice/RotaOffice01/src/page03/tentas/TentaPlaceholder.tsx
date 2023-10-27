import { GlobalState as GlobalState_, Repaintable, useNew } from "@libs";
import type React from "react";
import { createContext, useContext, type ReactNode } from "react";
import { TentaStage } from "./TentaStage";
import type { TentaPhaser } from "./TentaPhaser";




export module TentaPlaceholder
{


	//---




	export function use(id: React.Key)
	{
		let collector = useContext(CollectorContext)?.collector;

		if (!collector)
			return null;

		let exist = collector.byId(id);

		if (exist)
			return exist;

		throw Error(`Tenta.Placeholder.use(): попытка использовать tenta с ключом '${id}', который не был зарегистрирован в Tenta.Placeholder.Collector`)

	}
	//export function use(tenta: TentaBehavior)
	//{
	//	let col = useContext(CollectorContext);
	//	return col?.useTenta(tenta);
	//}



	//---




	export interface Props
	{
		stage: TentaStage;
	}


	export type DefaultProps = React.Key | {
		readonly id: React.Key;
		readonly defaultStage?: TentaStage;
	};

	export function DefaultProps(props: DefaultProps)
	{
		if (typeof props === "object")
			return props;

		return { id: props };
	}



	interface GlobalState extends GlobalState_
	{
		stage?: TentaStage;
	}



	export class Behavior
	{


		//---



		constructor(
			public collector: CollectorBehavior,
			public id: React.Key,
			public stage: TentaStage,
		)
		{
			//$log("create Placeholder")
		}


		use(tenta: TentaPhaser)
		{
			this.tenta = tenta;
			return this;
		}



		//---



		tenta?: TentaPhaser;

		prior: Behavior | null = null;
		next: Behavior | null = null;

		get collapsed() { return this.stage === "collapsed"; }
		get expanded() { return this.stage === "expanded"; }
		get opened() { return this.stage === "opened"; }



		//---



		globalState?: GlobalState;



		useGlobalState(name: string)
		{

			this.globalState = GlobalState_.use<GlobalState>(name);

			this.resolveGlobalState();


			return this;

		}



		resolveGlobalState()
		{

			if (!this.globalState)
				return;

			this.stage = GlobalState_.prop(this.globalState, 'stage', this.stage, TentaStage.Default, TentaStage.Default)!;

		}



		//---



		useTenta(tenta: TentaPhaser)
		{

			if (this.tenta && this.tenta !== tenta)
			{
				throw Error(`Tenta.Placeholder.CollectorBehavior: по ключу ${this.id} уже зарегистрирован placeholder с другой tenta`)
			}

			this.tenta = tenta;

		}



		//---



		setProps(props: Partial<Props>)
		{
			if (props.stage !== undefined)
			{
				this.stage = props.stage;
				this.resolveGlobalState();
			}
		}


		set(props: Partial<Props>)
		{
			this.setProps(props);
			this.collector.repaint();
		}



		//---


	}




	//---




	const CollectorContext = createContext<{ collector: CollectorBehavior | null }>({ collector: null });



	export function Collector(props: {
		root?: boolean;
		placeholders: DefaultProps[];
		children: ReactNode;
	})
	{
		let bhv = useNew(CollectorBehavior).use(props);

		return <CollectorContext.Provider
			value={{ collector: bhv }}
			children={props.children}
		/>;
	}


	export function NoCollector(props: { children: ReactNode })
	{
		return <CollectorContext.Provider
			value={{ collector: null }}
			children={props.children}
		/>;
	}




	export class CollectorBehavior extends Repaintable()
	{

		//---



		root!: boolean;

		placeholders!: Behavior[];



		//---



		use(cfg: Repaintable.UseConfig & {
			root?: boolean;
			placeholders: DefaultProps[]
		})
		{
			Repaintable.use(this, cfg);

			this.root = cfg?.root || false;

			this.usePlaceholders(cfg.placeholders);

			return this;
		}



		usePlaceholders(news: DefaultProps[])
		{

			let me = this;

			this.placeholders = mergePlaceholders(this.placeholders, news);

			this.placeholders.forEach((a, i, all) =>
			{
				a.prior = all[i - 1] || null;
				a.next = all[i + 1] || null;
			})

			function mergePlaceholders(olds: Behavior[], news: DefaultProps[])
			{
				return news.map(nn =>
				{
					let n = DefaultProps(nn);
					return (
						olds?.find(o => o.id === n.id)
						?? new Behavior(me, n.id, n.defaultStage || TentaStage.Default)
					);
				});

			}

		}



		//---



		byId(id: React.Key)
		{
			return this.placeholders.find(a => a.id === id);
		}

		indexById(id: React.Key)
		{
			return this.placeholders.findIndex(a => a.id === id);
		}



		//---

	}




	//---


}