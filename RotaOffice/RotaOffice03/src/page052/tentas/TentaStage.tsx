





////===






//export type TentaStage = "collapsed" | "expanded" | "opened";




//export module TentaStage
//{


//	//---




//	export var Default = "collapsed" as const;

//	export var Min = "collapsed" as const;
//	export var MinIndex = 0 as const;

//	export var Max = "opened" as const;
//	export var MaxIndex = 2 as const;




//	//---



		
//	const values: Record<TentaStage, 0 | 1 | 2> =
//	{
//		collapsed: 0,
//		expanded: 1,
//		opened: 2,
//	};

//	const stages: Record<number, TentaStage> =
//	{
//		0: "collapsed",
//		1: "expanded",
//		2: "opened",
//	};



//	export function min(a: TentaStage | undefined | null, b: TentaStage | undefined | null)
//	{

//		if (!a)
//			return b || TentaStage.Min;

//		if (!b)
//			return a || TentaStage.Min;


//		return stages[Math.min(values[a], values[b])] || TentaStage.Min;

//	}


//	export function max(a: TentaStage | undefined | null, b: TentaStage | undefined | null): TentaStage
//	{

//		if (!a)
//			return b || TentaStage.Min;

//		if (!b)
//			return a || TentaStage.Min;


//		return stages[Math.max(values[a], values[b])] || TentaStage.Min;

//	}



//	export function add(state: TentaStage | undefined | null, delta: number): TentaStage | null
//	{

//		if (!state)
//			return null;


//		let nextIndex = values[state] + delta;


//		if (nextIndex < MinIndex || nextIndex > MaxIndex)
//			return null;


//		return stages[nextIndex];

//	}




//	//---




//	export function indexOf(stage: TentaStage): number
//	{
//		return values[stage] || 0;
//	}


//	export function nameOf(stage: number | null | undefined): TentaStage | null
//	{
//		return stage && stages[stage] || null;
//	}




//	//---


//}
