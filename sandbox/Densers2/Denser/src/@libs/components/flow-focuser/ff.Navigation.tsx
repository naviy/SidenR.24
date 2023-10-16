import type { Focuser } from "./ff.Focuser";






//===






const defaultOverlap = 1.1;







export function findInDirection(
	focusers: Focuser[],
	dir: "left" | "up" | "right" | "down",
	ff0: Focuser,
	match?: (ff: Focuser) => boolean,
): Focuser | null
{

	return (
		dir === "left" ? findLeft(focusers, ff0, match) :
			dir === "up" ? findUp(focusers, ff0, match) :
				dir === "right" ? findRight(focusers, ff0, match) :
					findDown(focusers, ff0, match)
	);

}





export function findLeft(
	focusers: Focuser[],
	ff0: Focuser,
	match?: (ff: Focuser) => boolean
): Focuser | null
{

	let p0 = ff0.position!;
	let x01 = p0.x1;
	let y01 = p0.y1;
	let y02 = p0.y2;

	let nearest = new NearestPos("nearest");
	let nearest2 = new NearestPos("nearest-2");



	for (let ff of focusers)
	{

		if (!canNavigateFrom(ff0, ff, match))
			continue;


		let p = ff.position;

		let overlap = ff.props.overlapX ?? ff.props.overlap ?? defaultOverlap;

		if (!p || x01 < p.x2 - overlap)
			continue;


		let dx = x01 - p.x2;

		//let delta = x01 - (p.x2 + p.x1) / 2;
		let delta = x01 - p.x2;
		let delta2 = Math.abs((p.y1 + p.y2 - y01 - y02) / 2);


		if (p.y2 >= y01 - .5 * dx && p.y1 <= y02 + .5 * dx)
		{
			nearest.setIfNearest(ff, delta, delta2);
		}
		else if (p.y2 >= y01 - dx && p.y1 <= y02 + dx)
		{
			nearest2.setIfNearest(ff, delta, delta2);
		}

	}



	return nearest.bestFF(nearest2);

}



export function findRight(
	focusers: Focuser[],
	ff0: Focuser,
	match?: (ff: Focuser) => boolean
): Focuser | null
{

	let p0 = ff0.position!;
	let x02 = p0.x2;
	let y01 = p0.y1;
	let y02 = p0.y2;

	let nearest = new NearestPos("nearest");
	let nearest2 = new NearestPos("nearest-2");



	for (let ff of focusers)
	{

		if (!canNavigateFrom(ff0, ff, match))
			continue;


		//$log("ff1:", ff);

		let p = ff.position;

		let overlap = ff.props.overlapX ?? ff.props.overlap ?? defaultOverlap;

		//$log({ p0, p, p0_x2: x02, p_x1: p && p.x1 });

		if (!p || p.x1 < x02 - overlap)
			continue;


		let dx = p.x1 - x02;

		//let delta = (p.x2 + p.x1) / 2 - x02;
		let delta = p.x1 - x02;
		let delta2 = Math.abs((p.y1 + p.y2 - y01 - y02) / 2);


		if (p.y2 >= y01 - .5 * dx && p.y1 <= y02 + .5 * dx)
		{
			nearest.setIfNearest(ff, delta, delta2);
		}
		else if (p.y2 >= y01 - dx && p.y1 <= y02 + dx)
		{
			nearest2.setIfNearest(ff, delta, delta2);
		}

	}



	return nearest.bestFF(nearest2);

}



export function findUp(
	focusers: Focuser[],
	ff0: Focuser,
	match?: (ff: Focuser) => boolean
): Focuser | null
{

	let p0 = ff0.position!;
	let x01 = p0.x1;
	let x02 = p0.x2;
	let y01 = p0.y1;

	let nearest = new NearestPos("nearest");
	let nearest2 = new NearestPos("nearest-2");



	for (let ff of focusers)
	{

		if (!canNavigateFrom(ff0, ff, match))
			continue;


		let p = ff.position;

		let overlap = ff.props.overlapY ?? ff.props.overlap ?? defaultOverlap;

		if (!p || y01 < p.y2 - overlap)
			continue;


		let dy = y01 - p.y2;

		//let delta = y01 - (p.y2 + p.y1) / 2;
		let delta = y01 - p.y2;
		let delta2 = Math.abs((p.x1 + p.x2 - x01 - x02) / 2);


		if (p.x2 >= x01 - .5 * dy && p.x1 <= x02 + .5 * dy)
		{
			nearest.setIfNearest(ff, delta, delta2);
		}
		else if (p.x2 >= x01 - dy && p.x1 <= x02 + dy)
		{
			nearest2.setIfNearest(ff, delta, delta2);
		}

	}



	return nearest.bestFF(nearest2);

}



export function findDown(
	focusers: Focuser[],
	ff0: Focuser,
	match?: (ff: Focuser) => boolean
): Focuser | null
{

	//$logb("findDown");


	let p0 = ff0.position!;
	let x01 = p0.x1;
	let x02 = p0.x2;
	let y02 = p0.y2;

	let nearest = new NearestPos("nearest");
	let nearest2 = new NearestPos("nearest-2");



	for (let ff of focusers)
	{

		if (!canNavigateFrom(ff0, ff, match))
			continue;


		let p = ff.position;

		let overlap = ff.props.overlapY ?? ff.props.overlap ?? defaultOverlap;

		//$log({ p, y02, py1: p?.y1 });

		if (!p || p.y1 < y02 - overlap)
			continue;


		//$log("ff2:", ff);


		let dy = p.y1 - y02;

		//let delta = (p.y2 + p.y1) / 2 - y02;
		let delta = p.y1 - y02;
		let delta2 = Math.abs((p.x1 + p.x2 - x01 - x02) / 2);


		if (p.x2 >= x01 - .5 * dy && p.x1 <= x02 + .5 * dy)
		{
			//$$log("area: 0.5");
			nearest.setIfNearest(ff, delta, delta2);
		}
		else if (p.x2 >= x01 - dy && p.x1 <= x02 + dy)
		{
			//$$log("area: 1.0");
			nearest2.setIfNearest(ff, delta, delta2);
		}

	}


	let best = nearest.bestFF(nearest2);


	//$log("best:", best);

	
	//$loge("findDown");


	return best;

}






function canNavigateFrom(fromFF: Focuser, toFF: Focuser, match: undefined | ((ff: Focuser) => boolean))
{

	if (toFF === fromFF)
		return false;


	if (toFF.props.vnav || toFF.props.hnav || !toFF.canFocus())
		return false;


	if (match && !match(toFF))
		return false;


	let scope0 = fromFF.local ? fromFF.scope : null;

	if (scope0 && scope0 !== toFF && !scope0.isParentOf(toFF))
		return false;


	return true;

}







//===






class NearestPos
{

	//---



	constructor(public name: string)
	{
		this.delta = Infinity;
		this.delta2 = Infinity;
	}



	//---



	ff: Focuser | null = null;

	/** Дельта по основному направлению движения */
	delta: number;

	/** Дельта по отклонению от основновного направления движения (т.е. по второй оси) */
	delta2: number;

	distance?: number;

	priority = -Infinity;

	level = Infinity;


	//---



	setIfNearest(ff: Focuser, delta: number, delta2: number)
	{

		//$log("test:", ff);
		//$log("1:delta:", this.delta);
		//$log("2:delta:", delta);
		//$log("1:delta2:", this.delta2);
		//$log("2:delta2:", delta2);
		//$log("1:priority:", this.priority);
		//$log("2:priority:", ff.priority);

		if ((this.delta > delta) ||
			(Math.abs(delta - this.delta) < .01 && (this.delta2 > delta2 && ff.priority >= this.priority || ff.priority > this.priority)) ||
			(Math.abs(delta - this.delta) < .01 && Math.abs(ff.priority - this.priority) < .01 && ff.level < this.level)
		)
		{
			//$log("new nearest:", ff);
			this.ff = ff;
			this.delta = delta;
			this.delta2 = delta2;
			this.distance = delta * delta + delta2 * delta2;
			this.priority = ff.priority;
			this.level = ff.level;
		}

	}



	bestFF(second: NearestPos)
	{

		//$$log("nearest1:", this);
		//$$log("nearest2:", second);

		return (
			(second.priority - this.priority > .01) // если найденный сбоку приоритетней
				|| (second.distance && 4 * second.distance < this.distance!) // или в 2 раза ближе
				? second.ff
				: this.ff || second.ff
		);

	}



	//---

}