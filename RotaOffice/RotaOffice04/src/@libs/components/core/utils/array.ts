export { }






declare global
{



	interface ArrayConstructor
	{
		mapRange<T>(from: number, to: number, selector: (value: number, index: number) => T): T[];
	}




	interface Array<T>
	{

		add(item: T): T;

		clip(): Array<T> | null;

		register(item: T): boolean;
		registerBy(match: (a: T, b: T) => boolean, item: T): boolean;

		remove(item: T): boolean;
		removeRange(items: T[]): boolean;
		removeBy(item: (item: T, index?: number) => boolean): boolean;

		mapDefineds<T2>(selector: (value: T, index: number, array: T[]) => T2 | undefined): Array<T2>;

		//mapMany<T2>(selector: (value: T, index: number, array: T[]) => T2[]): Array<T2>;


	}



}






//===






Array.mapRange = function mapRange(from: number, to: number, selector: (value: number, index: number) => any)
{

	let len = to - from + 1;
	let result = Array(len);


	for (let i = 0; i < len; i++)
	{
		result[i] = selector(from + i, i);
	}


	return result;

}






//===






Array.prototype.add = function add(this: Array<any>, item: any)
{
	this.push(item);
	return item;
}



Array.prototype.clip = function clip(this: Array<any>)
{
	return this.length ? this : null;
}



Array.prototype.register = function register(this: Array<any>, item)
{

	if (item == null)
		return false;


	var result = false;


	if (this.indexOf(item) < 0)
	{
		this.push(item);
		result = true;
	}


	return result;

}



Array.prototype.registerBy = function registerBy(this: Array<any>, match: (a: any, b: any) => boolean, item)
{

	if (item == null)
		return false;


	if (item && this.find(a => match(a, item)) == null)
	{
		this.push(item);
		return true;
	}


	return false;

}




Array.prototype.remove = function remove<T>(this: Array<T>, item: T)
{

	if (item == null)
		return false;


	const i = this.indexOf(item);

	if (i < 0)
		return false;


	this.splice(i, 1);

	return true;

}




Array.prototype.removeRange = function removeRange<T>(this: Array<T>, items: T[])
{

	if (!items?.length)
		return false;


	let removed = false;


	for (let item of items)
	{
		removed = this.remove(item) || removed;
	}


	return removed;

}




Array.prototype.removeBy = function removeBy<T>(this: Array<T>, item: (item: T, index?: number) => boolean)
{

	if (item == null)
		return false;


	var result = false;


	while (true)
	{

		const i = this.findIndex(item as ((item: T, index?: number) => boolean));

		if (i < 0)
			break;


		this.splice(i, 1);
		result = true;

	}


	return result;

}




Array.prototype.mapDefineds = function mapDefineds(
	this: Array<any>,
	selector: (value: any, index: number, array: any[]) => any
)
{

	const result: any[] = [];

	if (!selector)
		return result;


	let item: any;

	for (let i = 0, len = this.length; i < len; ++i)
	{

		item = selector(this[i], i, this);

		if (item !== undefined)
			result.push(item);

	}


	return result;

}




//Array.prototype.mapMany = function mapMany(this: Array<any>, selector: (value: any, index: number, array: any[]) => any[])
//{

//	const result: any[] = [];

//	let subitems: any[];

//	for (let i = 0, len = this.length; i < len; ++i)
//	{

//		subitems = selector(this[i], i, this);

//		subitems && result.push(...subitems);

//	}


//	return result;

//}




