





//===






export type TentaStage = "collapsed" | "expanded" | "opened";




export module TentaStage
{


	//---




	export var Default = "collapsed" as const;
	export var Min = "collapsed" as const;
	export var MinIndex = 0 as const;
	export var Max = "opened" as const;
	export var MaxIndex = 2 as const;




	//---




	//export var Context = createContext<TentaStage | undefined>(undefined);



	//export function Provider(props: { stage: TentaStage; children: ReactNode; })
	//{
	//	return <Context.Provider
	//		value={props.stage}
	//		children={props.children}
	//	/>;
	//}



	//export function use(value?: TentaStage): TentaStage | undefined
	//{
	//	return value !== undefined ? value : useContext(Context);
	//}




	//---




	const values: Record<TentaStage, 0 | 1 | 2> =
	{
		collapsed: 0,
		expanded: 1,
		opened: 2,
	};

	const stages: Record<number, TentaStage> =
	{
		0: "collapsed",
		1: "expanded",
		2: "opened",
	};


	export function valueBy(stage: TentaStage)
	{
		return values[stage];
	}



	export function min(a: TentaStage | undefined | null, b: TentaStage | undefined | null)
	{

		if (!a)
			return b ?? TentaStage.Default;

		if (!b)
			return a ?? TentaStage.Default;


		return stages[Math.min(values[a], values[b])] as TentaStage;

	}


	export function max(a: TentaStage | undefined | null, b: TentaStage | undefined | null): TentaStage
	{

		if (!a)
			return b ?? TentaStage.Default;

		if (!b)
			return a ?? TentaStage.Default;


		return stages[Math.max(values[a], values[b])] as TentaStage;

	}




	//---




	export type Props = Record<TentaStage, boolean>;


	export function byProps(props: Readonly<Props>): TentaStage
	{
		return props.opened ? "opened" : props.expanded ? "expanded" : "collapsed";
	}


	export function indexOf(stage: TentaStage): number
	{
		return values[stage] || 0;
	}




	//---


}
